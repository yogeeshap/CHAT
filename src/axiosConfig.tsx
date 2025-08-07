import qs from 'qs'
import { type ReactElement, useEffect } from 'react'
import axios from 'axios';
import type {
  AxiosInstance,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse
} from 'axios';


import { useNavigate } from 'react-router-dom'

import authConfig from './authConfig'

const apiUrl = authConfig.auth.apiUrl

const options: CreateAxiosDefaults = {
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
}

const axiosInstance: AxiosInstance = axios.create(options)

const AxiosInterceptor = ({ children }: { children: ReactElement }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const onRequest = (config: InternalAxiosRequestConfig) => {
      return config
    }

    const onRequestError = (error: AxiosError): Promise<AxiosError> => {
      const message =
        (error.response && error.response.data) || 'Something went wrong!'
      return Promise.reject(message)
    }

    const onResponse = (response: AxiosResponse): AxiosResponse => response

    const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
      if (error.response && error.response.status === 401) {
        navigate('/login')
      }
      return Promise.reject(
        (error.response && error.response.data) || 'Something went wrong!'
      )
    }
    const requestInterceptor = axiosInstance.interceptors.request.use(
      onRequest,
      onRequestError
    )
    const responseInterceptor = axiosInstance.interceptors.response.use(
      onResponse,
      onResponseError
    )

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor)
      axiosInstance.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  return children
}

export default axiosInstance
export { AxiosInterceptor }
