import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { Link } from "react-router-dom";
import { getCommentsByHeritage, addComment, deleteComment, Comment } from "@/services/commentService";

interface HeritageCommentsProps {
  heritageId: number | string;
}


const formatTime = (ts: string | number) => {
  const date = new Date(ts);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

const HeritageComments = ({ heritageId }: HeritageCommentsProps) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentsByHeritage(Number(heritageId));
        setComments(data);
      } catch (error) {
        console.error("Failed to load comments", error);
      }
    };
    fetchComments();
  }, [heritageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast({ title: "Yêu cầu đăng nhập", description: "Vui lòng đăng nhập để bình luận.", variant: "destructive" });
      return;
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length <= 5) {
      toast({
        title: "Nội dung quá ngắn",
        description: "Bình luận phải có nhiều hơn 5 ký tự.",
        variant: "destructive",
      });
      return;
    }

    if (trimmedContent.length >= 150) {
      toast({
        title: "Nội dung quá dài",
        description: "Bình luận phải dưới 150 ký tự.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const newComment = await addComment(Number(heritageId), user.id, trimmedContent);
      setComments([newComment, ...comments]);
      setContent("");
      toast({ title: "Đã gửi bình luận", description: "Cảm ơn bạn đã chia sẻ!" });
    } catch (error: any) {
      toast({ title: "Lỗi gửi bình luận", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn muốn xoá bình luận này?")) return;
    try {
      await deleteComment(id);
      setComments(comments.filter((c) => c.id !== id));
      toast({ title: "Đã xoá bình luận" });
    } catch (error: any) {
      toast({ title: "Lỗi xoá bình luận", description: error.message, variant: "destructive" });
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="font-serif-display text-2xl text-primary">Bình luận</h2>
          <p className="text-sm text-muted-foreground">
            {comments.length > 0
              ? `${comments.length} bình luận từ cộng đồng`
              : "Hãy là người đầu tiên chia sẻ cảm nhận"}
          </p>
        </div>
      </div>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3 mb-8">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Bình luận dưới tên ${user.username}... (Trên 5 ký tự, dưới 150 ký tự)`}
            rows={3}
            maxLength={150}
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${content.length >= 150 ? "text-destructive" : "text-muted-foreground"}`}>
              {content.length}/150 ký tự
            </span>
            <Button type="submit" disabled={isSubmitting || content.length === 0} className="gap-2">
              <Send className="w-4 h-4" /> Gửi bình luận
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-muted/50 rounded-xl text-center border border-border">
          <p className="text-muted-foreground mb-3 text-sm">Vui lòng đăng nhập để bình luận về di sản này.</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/auth">Đăng nhập / Đăng ký</Link>
          </Button>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
          Chưa có bình luận nào.
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="flex gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-smooth"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{c.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(c.createdAt)}
                    </span>
                  </div>
                  {(user?.id === c.userId || user?.role === "Admin") && (
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-muted-foreground hover:text-destructive transition-smooth p-1"
                      aria-label="Xoá bình luận"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-foreground/85 whitespace-pre-wrap break-words">
                  {c.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default HeritageComments;