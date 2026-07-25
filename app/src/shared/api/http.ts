import ENV from '@/env'
import axios from 'axios'

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

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
