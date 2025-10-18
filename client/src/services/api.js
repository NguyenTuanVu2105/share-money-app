const API_BASE =
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "") + "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const payload = await response.json();
      message = payload.error || payload.message || message;
    } catch (_err) {
      // ignore JSON parse errors
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchRoommates() {
  return request("/roommates");
}

export function saveRoommates(payload) {
  return request("/roommates", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchExpenses() {
  return request("/expenses");
}

export function createExpense(payload) {
  return request("/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function removeExpense(id) {
  return request(`/expenses/${id}`, {
    method: "DELETE",
  });
}

export function removeAllExpenses() {
  return request("/expenses", {
    method: "DELETE",
  });
}

export function fetchMonthlySummary() {
  return request("/summary/monthly");
}

export function updateSettlement(month, settled) {
  return request(`/settlements/${month}`, {
    method: "PUT",
    body: JSON.stringify({ settled }),
  });
}
