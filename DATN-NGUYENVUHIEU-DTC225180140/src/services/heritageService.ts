import { getToken } from "./authService";

const BASE_URL = "https://tenhieu1-001-site1.ktempurl.com/api";

// Helper: fetch với timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 15000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      throw new Error("Server phản hồi quá chậm (timeout 15s). Backend có thể đang khởi động lại, vui lòng thử lại sau.");
    }
    throw new Error("Không thể kết nối đến server. Kiểm tra lại kết nối mạng hoặc thử lại sau.");
  }
};

// Helper: header với Bearer token
const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET ALL (PUBLISHED ONLY)
export const getHeritages = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/heritage`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không lấy được danh sách di sản");
  }
  return await res.json();
};

// GET ALL FOR ADMIN (bao gồm chờ duyệt)
export const getHeritagesForAdmin = async () => {
  const res = await fetchWithTimeout(`${BASE_URL}/heritage/admin/all`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không lấy được danh sách quản trị");
  }
  return await res.json();
};

// GET BY USER
export const getHeritagesByUser = async (userId: number) => {
  const res = await fetchWithTimeout(`${BASE_URL}/heritage/user/${userId}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không lấy được danh sách bài viết");
  }
  return await res.json();
};

// GET DETAIL
export const getHeritageDetail = async (slug: string) => {
  const res = await fetchWithTimeout(`${BASE_URL}/heritage/${slug}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không tìm thấy di sản");
  }
  return await res.json();
};

// APPROVE (Admin only)
export const approveHeritage = async (id: number | string) => {
  const res = await fetchWithTimeout(`${BASE_URL}/heritage/${id}/approve`, {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Duyệt thất bại");
  }
  return await res.json();
};

// CREATE (cần đăng nhập)
export const createHeritage = async (data: any) => {
  const res = await fetchWithTimeout(`${BASE_URL}/heritage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  }, 20000);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Tạo di sản thất bại");
  }
  return await res.json();
};

// UPDATE (Admin only)
export const updateHeritage = async (id: number | string, data: any) => {
  const res = await fetchWithTimeout(`${BASE_URL}/heritage/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  }, 20000);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Cập nhật thất bại");
  }
  return await res.json();
};

// DELETE (Admin only)
export const deleteHeritage = async (id: number) => {
  const res = await fetchWithTimeout(`${BASE_URL}/heritage/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Xoá thất bại");
  }
  return true;
};

// UPLOAD ẢNH (cần đăng nhập)
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchWithTimeout(`${BASE_URL}/heritage/upload`, {
    method: "POST",
    headers: authHeaders(), // không set Content-Type, browser tự set multipart
    body: formData,
  }, 30000);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload ảnh thất bại");
  }
  return await res.json();
};