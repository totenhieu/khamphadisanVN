const API_URL = "https://tenhieu1-001-site1.ktempurl.com/api/comments";

export type Comment = {
  id: number;
  heritageId: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
};

export const getCommentsByHeritage = async (heritageId: number): Promise<Comment[]> => {
  const res = await fetch(`${API_URL}/heritage/${heritageId}`);
  if (!res.ok) {
    throw new Error("Không thể tải bình luận");
  }
  return await res.json();
};

export const addComment = async (heritageId: number, userId: number, content: string): Promise<Comment> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ heritageId, userId, content }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Lỗi khi gửi bình luận");
  }

  return await res.json();
};

export const deleteComment = async (commentId: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Lỗi khi xoá bình luận");
  }
};
