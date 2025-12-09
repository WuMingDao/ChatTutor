export const useSettings = () => {
  const baseURL = ref<string>('')
  const apiKey = ref<string>('')
  const agentModel = ref<string>('')
  const titleModel = ref<string>('')

  const saveBaseURL = (baseURL: string) => {
    localStorage.setItem('baseURL', baseURL)
  }
  const saveAPIKey = (apiKey: string) => {
    localStorage.setItem('apiKey', apiKey)
  }
  const saveAgentModel = (agentModel: string) => {
    localStorage.setItem('agentModel', agentModel)
  }
  const saveTitleModel = (titleModel: string) => {
    localStorage.setItem('titleModel', titleModel)
  }

  const saveSettings = () => {
    saveBaseURL(baseURL.value)
    saveAPIKey(apiKey.value)
    saveAgentModel(agentModel.value)
    saveTitleModel(titleModel.value)
  }

  const loadSettings = () => {
    baseURL.value = localStorage.getItem('baseURL') ?? ''
    apiKey.value = localStorage.getItem('apiKey') ?? ''
    agentModel.value = localStorage.getItem('agentModel') ?? ''
    titleModel.value = localStorage.getItem('titleModel') ?? ''
  }

  onMounted(() => {
    loadSettings()
  })

  return {
    baseURL,
    apiKey,
    agentModel,
    titleModel,
    saveSettings,
    loadSettings,
    saveBaseURL,
    saveAPIKey,
    saveAgentModel,
    saveTitleModel,
  }
}