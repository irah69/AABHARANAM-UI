const ACCESS_TOKEN_KEY = "AABHARANAM_access_token";

export function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeAccessToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (!token) window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    else window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore storage errors
  }
}

export function clearStoredAccessToken() {
  storeAccessToken(null);
}

