// Builds a /carrinhos request payload from one or more products.

/**
 * @param {Array<{_id: string}>} produtos - products (as returned by the API) to put in the cart
 * @param {number} quantidade - quantity per product
 */
export function makeCart(produtos, quantidade = 1) {
  return {
    produtos: produtos.map((produto) => ({
      idProduto: produto._id,
      quantidade,
    })),
  };
}
