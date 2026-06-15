import axios from 'axios'

// 1. Cria a instância do Axios com a URL base do seu Spring Boot
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // Cancela a requisição se o back-end demorar mais de 10 segundos
})

// 2. Interceptador de Requisição: Adiciona o token de login automaticamente
api.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem('user_token')
    
    if (savedUser) {
      const user = JSON.parse(savedUser)
      // Caso seu back-end use JWT futuramente, o token já será injetado aqui:
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 3. Interceptador de Resposta: Trata erros globais (como token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o back-end retornar 401 (Não autorizado), limpa o login e desloga o usuário
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api