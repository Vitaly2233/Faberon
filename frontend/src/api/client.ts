import createClient from 'openapi-fetch'
import type { paths } from './generated/schema'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'
const baseUrl = configuredBaseUrl.replace(/\/api\/v1\/?$/, '')

export const apiClient = createClient<paths>({ baseUrl })
