const BASE_URL = "https://tenhieu1-001-site1.ktempurl.com/api/auth";

export const loginApi = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return await res.json();
};
export const registerApi = async (
  username: string,
  password: string,
  phoneNumber: string
) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      phoneNumber,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Register failed");
  }

  return await res.json();
};

export const getUserCountApi = async () => {
  const res = await fetch(`${BASE_URL}/users/count`);
  if (!res.ok) {
    return 0; // Trả về 0 nếu có lỗi
  }
  const data = await res.json();
  return data.count;
};

export const getAllUsersApi = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return await res.json();
};

export const toggleUserStatusApi = async (userId: number, isLocked: boolean) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/toggle-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isLocked }),
  });
  if (!res.ok) {
    throw new Error("Failed to toggle status");
  }
  return await res.json();
};