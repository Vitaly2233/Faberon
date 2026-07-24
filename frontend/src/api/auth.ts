import type { components } from './generated/schema'
import { apiClient } from './client'
import { setAccessToken } from './auth-token'

type LoginRequest = components['schemas']['LoginRequest']
type LoginResponse = components['schemas']['LoginResponse']
type UserResponse = components['schemas']['UserResponse']

export async function login(input: LoginRequest): Promise<LoginResponse> {
  const { data, error, response } = await apiClient.POST('/api/v1/auth/login', {
    body: input,
  })

  if (error) {
    if (response.status === 401) {
      throw new Error('Invalid email or password.')
    }
    throw new Error('Failed to sign in.')
  }

  setAccessToken(data.accessToken)
  return data
}

export async function getMe(): Promise<UserResponse> {
  const { data, error, response } = await apiClient.GET('/api/v1/auth/me')

  if (error) {
    if (response.status === 401) {
      throw new Error('Sign in to continue.')
    }
    throw new Error('Failed to load session.')
  }

  return data
}
