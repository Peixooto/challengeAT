import { apiRequest } from './apiClient';

export function create(user) {
  return apiRequest({
    method: 'POST',
    url: '/usuarios',
    body: user,
  });
}

export function getById(id) {
  return apiRequest({
    method: 'GET',
    url: `/usuarios/${id}`,
  });
}

export function remove(id) {
  return apiRequest({
    method: 'DELETE',
    url: `/usuarios/${id}`,
  });
}
