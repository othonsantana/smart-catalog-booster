const AUTH_KEY = "ci_auth";
const AUTH_PIN = "admin123";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function login(password: string): boolean {
  if (password === AUTH_PIN) {
    localStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "/";
}
