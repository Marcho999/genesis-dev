/**
 * @typedef {Object} Product
 * @property {string|number} id
 * @property {string} nombre
 * @property {string} marca
 * @property {string} categoria
 * @property {number} precio
 * @property {number} stock
 * @property {string} [imagen]
 */

export function createProduct(data = {}) {
  return {
    id: null,
    nombre: '',
    marca: '',
    categoria: '',
    precio: 0,
    stock: 0,
    imagen: '',
    ...data,
  }
}
