import createClient from 'openapi-fetch'
import type { paths } from './generated/schema'
import { clearAccessToken, getAccessToken } from './auth-token'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'
const baseUrl = configuredBaseUrl.replace(/\/api\/v1\/?$/, '')

export const apiClient = createClient<paths>({ baseUrl })

apiClient.use({
  onRequest({ request }) {
    const token = getAccessToken()
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },
  onResponse({ request, response }) {
    if (response.status !== 401) {
      return response
    }

    const path = new URL(request.url).pathname
    if (path === '/api/v1/auth/login') {
      return response
    }

    clearAccessToken()
    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
    return response
  },
})
