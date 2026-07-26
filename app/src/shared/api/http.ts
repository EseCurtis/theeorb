import ENV from '@/env'
import axios from 'axios'

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

export function setAuthenticationToken(token: string | null): void {
  if (!token) {
    delete http.defaults.headers.common.Authorization
    return
  }

  http.defaults.headers.common.Authorization = `Bearer ${token}`
}

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message?.desc ??
        error.response?.data?.error ??
        error.message

      return Promise.reject(new Error(String(message)))
    }

    return Promise.reject(
      error instanceof Error ? error : new Error('Request failed'),
    )
  },
)
