import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Landmark, Loader2, Mail, Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const signinSchema = z.object({
  email: z.string().trim().email({ message: "Email không hợp lệ" }).max(255),
  password: z.string().min(1, { message: "Nhập mật khẩu" }).max(72),
});

const signupSchema = z
  .object({
    email: z.string().trim().email({ message: "Email không hợp lệ" }).max(255),
    phone: z.string().min(1, { message: "Nhập số điện thoại" }),
    password: z.string().min(1, { message: "Nhập mật khẩu" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const parsed =
      mode === "signup"
        ? signupSchema.safeParse({ email, phone, password, confirmPassword })
        : signinSchema.safeParse({ email, password });

    if (!parsed.success) {
      toast({
        title: "Lỗi",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    try {
      if (mode === "signin") {
        const res = await fetch("https://localhost:7216/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: email,
            password: password,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          if (errorData && errorData.message) {
            throw new Error(errorData.message);
          } else {
            throw new Error("Sai tài khoản hoặc mật khẩu");
          }
        }
        const data = await res.json();
        // Giả sử API trả về { token, user: { id, username, role } }
        localStorage.setItem("user", JSON.stringify(data.user));

        toast({ title: "Đăng nhập thành công 🎉" });
        navigate("/");
      } else {
        // ĐĂNG KÝ
        const res = await fetch("https://localhost:7216/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: email,
            password: password,
            phoneNumber: phone
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Đăng ký thất bại");
        }

        toast({ title: "Đăng ký thành công! Vui lòng đăng nhập." });
        setMode("signin");
      }
    } catch (err: any) {
      toast({
        title: "Lỗi",
        description: err.message,
        variant: "destructive",
      });
    }

    setSubmitting(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/30 to-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-11 h-11 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold">Khám phá địa phương</div>
            <div className="text-xs">Local Discovery</div>
          </div>
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-elegant p-8">
          <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-md",
                  mode === m
                    ? "bg-background text-primary shadow-soft"
                    : "text-muted-foreground"
                )}
              >
                {m === "signin" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-bold mb-4">
            {mode === "signin" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ban@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* PHONE */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* CONFIRM */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label>Nhập lại mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            <Button className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin mr-2" />}
              {mode === "signin" ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Auth;