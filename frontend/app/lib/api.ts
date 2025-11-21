// a small helper for calling backend with auth handling (refresh on 401)
export async function fetchWithAuth(input: string, init: RequestInit = {}, accessToken: string | undefined, setAccessToken: (t: string | null) => void) {
  const token = accessToken
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  console.log(input)
  const res = await fetch(input, {
    ...init,
    headers,
    credentials: "include" // include cookies for refresh endpoint
  });
  console.log(res)
  if (res.status !== 401) {
    return res;
  }

  // try refresh once
  const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/refresh`, {
    method: "POST",
    credentials: "include"
  });

  if (!refreshRes.ok) {
    // refresh failed -> clear token
    setAccessToken(null);
    return res; // original 401
  }

  const data = await refreshRes.json();
  const newAccess = data.access_token;
  setAccessToken(newAccess);

  // retry original request with new token
  const retryHeaders = new Headers(init.headers || {});
  retryHeaders.set("Authorization", `Bearer ${newAccess}`);
  return fetch(input, {
    ...init,
    headers: retryHeaders,
    credentials: "include"
  });
}
