import { apiRequest } from './apiClient';

export function create(cart, authorization) {
  return apiRequest({
    method: 'POST',
    url: '/carrinhos',
    headers: authorization ? { Authorization: authorization } : undefined,
    body: cart,
  });
}

export function getById(id) {
  return apiRequest({
    method: 'GET',
    url: `/carrinhos/${id}`,
  });
}

export function completePurchase(authorization) {
  return apiRequest({
    method: 'DELETE',
    url: '/carrinhos/concluir-compra',
    headers: authorization ? { Authorization: authorization } : undefined,
  });
}

export function cancelPurchase(authorization) {
  return apiRequest({
    method: 'DELETE',
    url: '/carrinhos/cancelar-compra',
    headers: authorization ? { Authorization: authorization } : undefined,
  });
}
