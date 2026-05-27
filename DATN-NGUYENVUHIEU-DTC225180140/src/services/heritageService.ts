const BASE_URL = "https://tenhieu1-001-site1.ktempurl.com/api";

// 🔥 GET ALL (PUBLISHED ONLY - CHO NGƯỜI DÙNG)
export const getHeritages = async () => {
  const res = await fetch(`${BASE_URL}/heritage`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không lấy được danh sách di sản");
  }

  return await res.json();
};

// 🔥 GET ALL FOR ADMIN (BAO GỒM CHỜ DUYỆT)
export const getHeritagesForAdmin = async () => {
  const res = await fetch(`${BASE_URL}/heritage/admin/all`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không lấy được danh sách quản trị");
  }

  return await res.json();
};

// 🔥 GET BY USER (LẤY BÀI CỦA USER ĐÓ)
export const getHeritagesByUser = async (userId: number) => {
  const res = await fetch(`${BASE_URL}/heritage/user/${userId}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không lấy được danh sách bài viết");
  }

  return await res.json();
};

// 🔥 GET DETAIL
export const getHeritageDetail = async (slug: string) => {
  const res = await fetch(`${BASE_URL}/heritage/${slug}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không tìm thấy di sản");
  }

  return await res.json();
};

// 🔥 APPROVE (DUYỆT BÀI)
export const approveHeritage = async (id: number | string) => {
  const res = await fetch(`${BASE_URL}/heritage/${id}/approve`, {
    method: "PUT"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Duyệt thất bại");
  }

  return await res.json();
};

// 🔥 CREATE
export const createHeritage = async (data: any) => {
  const res = await fetch(`${BASE_URL}/heritage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 🔐 nếu có login thì bật dòng dưới
      // "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Tạo di sản thất bại");
  }

  return await res.json();
};

// 🔥 UPDATE
export const updateHeritage = async (id: number | string, data: any) => {
  const res = await fetch(`${BASE_URL}/heritage/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Cập nhật thất bại");
  }

  return await res.json();
};

// 🔥 DELETE
export const deleteHeritage = async (id: number) => {
  const res = await fetch(`${BASE_URL}/heritage/${id}`, {
    method: "DELETE",
    headers: {
      // 🔐 nếu có login thì bật
      // "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Xoá thất bại");
  }

  return true;
};

// 🔥 UPLOAD ẢNH
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/heritage/upload`, {
    method: "POST",
    headers: {
      // 🔐 nếu có login thì bật
      // "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: formData, // Không set Content-Type vì trình duyệt tự set multipart/form-data
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload ảnh thất bại");
  }

  return await res.json(); // { url: "http://..." }
};