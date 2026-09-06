import { apiRequest } from './apiClient';

export function login(credentials) {
  return apiRequest({
    method: 'POST',
    url: '/login',
    body: credentials,
  });
}
