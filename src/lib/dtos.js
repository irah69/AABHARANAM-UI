/**
 * DTOs are documented via JSDoc so you still get intellisense in JS.
 *
 * @typedef {Object} CategoryDto
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 *
 * @typedef {Object} ProductDto
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 * @property {number} price
 * @property {number} [stockQuantity]
 * @property {string} [imageUrl]
 * @property {number} [categoryId]
 * @property {CategoryDto} [category]
 * @property {string} [createdAt]
 *
 * @typedef {Object} AuthLoginResponse
 * @property {string} accessToken
 * @property {string} tokenType
 * @property {string} role
 *
 * @typedef {Object} CartItemDto
 * @property {number} productId
 * @property {number} quantity
 * @property {ProductDto} [product]
 *
 * @typedef {Object} CartDto
 * @property {CartItemDto[]} items
 *
 * @typedef {Object} OrderItemDto
 * @property {number} productId
 * @property {number} quantity
 * @property {number} [unitPrice]
 * @property {ProductDto} [product]
 *
 * @typedef {Object} OrderDto
 * @property {number} id
 * @property {string} [status]
 * @property {number} [total]
 * @property {string} [createdAt]
 * @property {OrderItemDto[]} [items]
 */

export {};

