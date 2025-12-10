/**
 * Cliente HTTP para comunicación con el backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { APP_CONFIG } from '@/config/app';
import type { ApiError, ApiResponse } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: APP_CONFIG.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        const apiError: ApiError = {
          detail: error.response?.data?.detail || error.message || 'Error desconocido',
          code: error.code,
        };
        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, { params });
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        error: error as ApiError,
        success: false,
      };
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        error: error as ApiError,
        success: false,
      };
    }
  }

  async postFormData<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        error: error as ApiError,
        success: false,
      };
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        error: error as ApiError,
        success: false,
      };
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        error: error as ApiError,
        success: false,
      };
    }
  }
}

export const apiClient = new ApiClient();
