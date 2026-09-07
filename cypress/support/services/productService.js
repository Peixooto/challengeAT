import { apiRequest } from './apiClient';

export function create(product, authorization) {
  return apiRequest({
    method: 'POST',
    url: '/produtos',
    headers: authorization ? { Authorization: authorization } : undefined,
    body: product,
  });
}

export function update(id, product, authorization) {
  return apiRequest({
    method: 'PUT',
    url: `/produtos/${id}`,
    headers: authorization ? { Authorization: authorization } : undefined,
    body: product,
  });
}

export function getById(id) {
  return apiRequest({
    method: 'GET',
    url: `/produtos/${id}`,
  });
}

export function getByName(name) {
  return apiRequest({
    method: 'GET',
    url: `/produtos?nome=${encodeURIComponent(name)}`,
  });
}

export function remove(id, authorization) {
  return apiRequest({
    method: 'DELETE',
    url: `/produtos/${id}`,
    headers: authorization ? { Authorization: authorization } : undefined,
  });
}
