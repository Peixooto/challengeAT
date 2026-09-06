export function makeCart(produtos, quantidade = 1) {
  return {
    produtos: produtos.map((produto) => ({
      idProduto: produto._id,
      quantidade,
    })),
  };
}
