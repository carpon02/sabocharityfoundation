/**
 * Session helpers. JWTs are httpOnly cookies now — these no longer store secrets.
 */

export const getToken = () => null;
export const setToken = () => {};
export const removeToken = () => {};
export const getAuthHeader = () => ({});
export const isAuthenticated = () => false;
