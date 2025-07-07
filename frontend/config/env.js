export const env = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5253",
  BACKEND_PRODUCTS_URL:
    import.meta.env.VITE_BACKEND_PRODUCTS_URL ||
    "http://localhost:5253/products",
  BACKEND_USERS_URL:
    import.meta.env.VITE_BACKEND_USERS_URL || "http://localhost:5253/users",
};
