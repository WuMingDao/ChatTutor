import type { Action, BaseForm, FullizeAction, Page, SliderForm } from '@chat-tutor/shared'
import { FormType, PageType } from '@chat-tutor/shared'
import type { Tool, Message } from 'xsai'
import { tool } from 'xsai'
import { type } from 'arktype'
import type { CanvasPage, DocumentAction } from '@chat-tutor/canvas'
import { createPainterAgent } from '../painter'
import type { AgentChunker } from '../types'
import type { PageCreationAction } from '..'

export type CanvasPageDrawStartAction = Action<{
  page: string
  input: string
}, 'draw-start'>
export type CanvasPageDrawEndAction = Action<{
  page: string
  result: string
}, 'draw-end'>
export type FormCreationAction<T extends BaseForm<FormType> = BaseForm<FormType>> = Action<T, 'form-creation'>

export const getAgentTools = async (
  { pages, painterOptions, chunker }: {
    pages: Page[]
    painterOptions: {
      apiKey: string
      baseURL: string
      model: string
      messages: Record<string, Message[]>
    }
    chunker: AgentChunker
  }
) => {
  const checkExist = (id: string) => {
    if (pages.find(page => page.id === id)) {
      return {
        success: false,
        message: 'Page already exists',
      }
    }
  }
  const createCanvas = tool({
    name: 'create_canvas',
    description: 'Create a new canvas page',
    parameters: type({
      id: 'string',
      title: 'string',
    }),
    execute: async ({ id, title }) => {
      const result = checkExist(id)
      if (result) {
        return result
      }
      const p: CanvasPage = {
        id,
        title,
        type: PageType.CANVAS,
        steps: [],
        notes: [],
        forms: [],
      }
      pages.push(p)

      chunker({
        type: 'page',
        options: p,
      } as PageCreationAction<CanvasPage>)
      return {
        success: true,
        message: 'Page created successfully',
        page: id,
      }
    },
    strict: false
  })

  const createSlider = tool({
    name: 'create_slider',
    description: 'Create a slider form on a page based on a reactive variable',
    parameters: type({
      page: type('string').describe('The page id to create the slider on'),
      bind: type('string').describe('The reactive variable name to bind to the slider'),
      min: type('number').describe('The minimum value of the slider'),
      max: type('number').describe('The maximum value of the slider'),
      step: type('number').describe('The step value of the slider'),
      value: type('number').describe('The initial value of the slider'),
      title: type('string').describe('The title of the slider'),
    }),
    execute: async ({ page, bind, min, max, step, value, title }) => {
      const targetPage = pages.find(p => p.id === page)
      if (!targetPage) {
        return {
          success: false,
          message: 'Page not found',
        }
      }
      targetPage.forms.push({
        type: FormType.SLIDER,
        bind,
        min,
        max,
        step,
        value,
        title,
      } as SliderForm)
      const action: FullizeAction<FormCreationAction<SliderForm>> = {
        type: 'form-creation',
        options: {
          type: FormType.SLIDER,
          bind,
          min,
          max,
          step,
          value,
          title,
        },
        page: targetPage.id,
      }
      chunker(action)
      return {
        success: true,
        message: 'Slider created successfully',
        page: page,
      }
    },
  })

  const draw = tool({
    name: 'draw',
    description: 'Draw on a page with natural language use painter sub-agent',
    parameters: type({
      page: type('string').describe('The page id to draw on'),
      input: type('string').describe('The natural language input to draw on the page'),
      refs: type.Record(type('string').describe('The name of the variable'), type('string').describe('The description of the variable')).describe('The reactive variables to be exposed'),
    }),
    execute: async ({ page, input, refs: rs }) => {
      chunker({
        type: 'draw-start',
        options: { page, input },
      } as CanvasPageDrawStartAction)
      const targetPage = pages.find(p => p.id === page)
      if (!targetPage) {
        return {
          success: false,
          message: 'Page not found',
        }
      }
      painterOptions.messages[targetPage.id!] ??= []
      const painter = createPainterAgent({
        ...painterOptions,
        messages: painterOptions.messages[targetPage.id!],
      })
      const { content, refs } = await painter({
        content: input,
        refs: rs,
      })
      const action = {
        type: 'document',
        options: { content },
        page,
      } as DocumentAction
      chunker(action)
      targetPage.steps.push(action)
      chunker({
        type: 'draw-end',
        options: { page, result: content },
      } as CanvasPageDrawEndAction)
      return {
        success: true,
        message: {
          refs,
        },
      }
    },
  })

  return await Promise.all([createCanvas, createSlider, draw]) as Tool[]
}