// composables/useMacsApi.js
import { useRuntimeConfig } from 'nuxt/app';

export const useMacsApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || 'http://localhost:8080';

  const fetcher = async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    try {
      const response = await $fetch(url, options);
      return response;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  };

  return {
    fetcher
  };
};
