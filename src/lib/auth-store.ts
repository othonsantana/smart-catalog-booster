const AUTH_KEY = "ci_auth";
const ADMIN_USER = "othonsantana";
const ADMIN_PASS = "rh336699";

type AuthData = {
  role: "admin" | "reseller";
  slug?: string;
  username: string;
};

export function getAuth(): AuthData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function isAuthenticated(): boolean {
  return getAuth() !== null;
}

export function isAdmin(): boolean {
  return getAuth()?.role === "admin";
}

export function isReseller(): boolean {
  return getAuth()?.role === "reseller";
}

export function getCurrentSlug(): string | null {
  return getAuth()?.slug ?? null;
}

export function login(username: string, password: string): { success: boolean; role?: "admin" | "reseller"; slug?: string } {
  // Check admin
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const data: AuthData = { role: "admin", username };
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    return { success: true, role: "admin" };
  }

  // Check resellers from admin store
  try {
    const raw = localStorage.getItem("ci_admin_v1");
    if (raw) {
      const state = JSON.parse(raw) as { resellers?: Record<string, { slug: string; username?: string; password?: string; active?: boolean }> };
      if (state.resellers) {
        for (const r of Object.values(state.resellers)) {
          if (r.username === username && r.password === password) {
            if (r.active === false) {
              return { success: false }; // blocked
            }
            const data: AuthData = { role: "reseller", slug: r.slug, username };
            localStorage.setItem(AUTH_KEY, JSON.stringify(data));
            return { success: true, role: "reseller", slug: r.slug };
          }
        }
      }
    }
  } catch {}

  return { success: false };
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "/";
}
