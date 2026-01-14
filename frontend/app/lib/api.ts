let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRerfreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export async function fetchWithAuth(input: string, init: RequestInit = {}, accessToken: string | null, setAccessToken: (t: string | null) => void) {
  const headers = new Headers(init.headers || {});
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let res = await fetch(input, { ...init, headers, credentials: "include" });

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include"
        });

        if (refreshRes.ok) {
          const { access_token } = await refreshRes.json();
          setAccessToken(access_token);
          isRefreshing = false;
          onRerfreshed(access_token);
        } else {
          isRefreshing = false;
          setAccessToken(null);
          return res;
        }
      } catch (err) {
        isRefreshing = false;
        return res;
      }
    }

    // If already refreshing, wait for the result
    const retryToken = await new Promise<string>((resolve) => {
      subscribeTokenRefresh((token) => resolve(token));
    });

    const retryHeaders = new Headers(init.headers || {});
    retryHeaders.set("Authorization", `Bearer ${retryToken}`);
    return fetch(input, { ...init, headers: retryHeaders, credentials: "include" });
  }

  return res;
}