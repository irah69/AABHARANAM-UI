import { ApiError } from "@/lib/apiError";

/**
 * @param {string} path - path under API prefix, e.g. "/products"
 * @param {{
 *   method?: string,
 *   token?: string | null,
 *   query?: Record<string, any>,
 *   body?: any,
 *   signal?: AbortSignal,
 *   headers?: Record<string, string>
 * }} [options]
 */
export async function apiRequest(path, options = {}) {
  const {
    method = options.body ? "POST" : "GET",
    token = null,
    query,
    body,
    signal,
    headers = {},
  } = options;

  const baseUrl = "https://murgan-backend.onrender.com/api";

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
  }

  const url = new URL(`${baseUrl}${path}`);

  // Attach query params
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  const hasJsonBody =
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData);

  if (hasJsonBody) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers: requestHeaders,
    body: hasJsonBody ? JSON.stringify(body) : body,
    signal,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const payload = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (payload &&
        typeof payload === "object" &&
        (payload.message || payload.error)) ||
      (typeof payload === "string" && payload) ||
      `Request failed (${res.status})`;

    throw new ApiError(String(message), {
      status: res.status,
      details: payload,
    });
  }

  return payload;
}

/* ============================= */
/*          PUBLIC API           */
/* ============================= */

export const publicApi = {
  getCategories: (signal) =>
    apiRequest("/categories", { signal }),

  getCategory: (id, signal) =>
    apiRequest(`/categories/${id}`, { signal }),

  getProducts: (
    { page = 0, size = 12, sort = "createdAt,desc" } = {},
    signal
  ) =>
    apiRequest("/products", {
      query: { page, size, sort },
      signal,
    }),

  getProduct: (id, signal) =>
    apiRequest(`/products/${id}`, { signal }),

  searchProducts: (
    {
      categoryId,
      q,
      minPrice,
      maxPrice,
      inStock,
      page = 0,
      size = 12,
      sort = "createdAt,desc",
    } = {},
    signal
  ) =>
    apiRequest("/products/search", {
      query: {
        categoryId,
        q,
        minPrice,
        maxPrice,
        inStock,
        page,
        size,
        sort,
      },
      signal,
    }),
};

/* ============================= */
/*           AUTH API            */
/* ============================= */

export const authApi = {
  register: (body, signal) =>
    apiRequest("/auth/register", {
      method: "POST",
      body,
      signal,
    }),

  login: (body, signal) =>
    apiRequest("/auth/login", {
      method: "POST",
      body,
      signal,
    }),
};

/* ============================= */
/*           USER API            */
/* ============================= */

export const userApi = {
  getCart: (token, signal) =>
    apiRequest("/cart", { token, signal }),

  addCartItem: (token, body, signal) =>
    apiRequest("/cart/items", {
      method: "POST",
      token,
      body,
      signal,
    }),

  patchCartItem: (token, productId, body, signal) =>
    apiRequest(`/cart/items/${productId}`, {
      method: "PATCH",
      token,
      body,
      signal,
    }),

  deleteCartItem: (token, productId, signal) =>
    apiRequest(`/cart/items/${productId}`, {
      method: "DELETE",
      token,
      signal,
    }),

  checkout: (token, body, signal) =>
    apiRequest("/cart/checkout", {
      method: "POST",
      token,
      body,
      signal,
    }),

  getOrders: ({ token, page = 0, size = 10 } = {}, signal) =>
    apiRequest("/orders", {
      token,
      query: { page, size },
      signal,
    }),
};

/* ============================= */
/*           ADMIN API           */
/* ============================= */

export const adminApi = {
  getDashboard: (token, signal) =>
    apiRequest("/admin/dashboard", { token, signal }),

  getUsers: ({ token, page = 0, size = 20 } = {}, signal) =>
    apiRequest("/admin/users", {
      token,
      query: { page, size },
      signal,
    }),

  createCategory: (token, body, signal) =>
    apiRequest("/admin/categories", {
      method: "POST",
      token,
      body,
      signal,
    }),

  updateCategory: (token, id, body, signal) =>
    apiRequest(`/admin/categories/${id}`, {
      method: "PUT",
      token,
      body,
      signal,
    }),

  deleteCategory: (token, id, signal) =>
    apiRequest(`/admin/categories/${id}`, {
      method: "DELETE",
      token,
      signal,
    }),

  createProduct: (token, body, signal) =>
    apiRequest("/admin/products", {
      method: "POST",
      token,
      body,
      signal,
    }),

  updateProduct: (token, id, body, signal) =>
    apiRequest(`/admin/products/${id}`, {
      method: "PUT",
      token,
      body,
      signal,
    }),

  deleteProduct: (token, id, signal) =>
    apiRequest(`/admin/products/${id}`, {
      method: "DELETE",
      token,
      signal,
    }),
};