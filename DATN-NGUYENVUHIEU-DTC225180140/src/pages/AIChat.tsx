import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAIAssistant } from "@/services/aiService";

type Msg = { role: "user" | "ai"; text: string };

const starters = [
  "Cố đô Huế có ý nghĩa lịch sử như thế nào?",
  "Gợi ý hành trình 3 ngày khám phá Hội An.",
  "Văn Miếu được xây dựng năm nào?",
  "Mỹ Sơn khác gì so với Angkor Wat?",
];


const AIChat = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Xin chào! Mình là hướng dẫn viên khám phá di sản địa phương. Bạn muốn khám phá di sản nào hôm nay?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const answer = await askAIAssistant(q);
      setMessages((m) => [...m, { role: "ai", text: answer }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: "ai", text: "Xin lỗi, hiện tại hệ thống AI đang quá tải hoặc gặp sự cố. Vui lòng thử lại sau!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-primary text-xs uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> AI hướng dẫn viên ảo
            </div>
            <h1 className="font-serif-display text-4xl md:text-5xl font-bold mb-2">
              Trò chuyện cùng <span className="text-gradient-primary italic">AI</span>
            </h1>
            <p className="text-muted-foreground">Đặt câu hỏi về bất kỳ di sản, lịch sử hay hành trình nào bạn quan tâm.</p>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-elegant overflow-hidden flex flex-col h-[65vh] min-h-[520px]">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-warm">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}>
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${m.role === "ai" ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    {m.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "ai" ? "bg-card border border-border shadow-soft rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground"><Bot className="w-5 h-5" /></div>
                  <div className="px-4 py-3 rounded-2xl bg-card border border-border shadow-soft">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "120ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "240ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="px-6 py-3 border-t border-border bg-card">
                <p className="text-xs text-muted-foreground mb-2">Câu hỏi gợi ý:</p>
                <div className="flex flex-wrap gap-2">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-4 border-t border-border bg-card flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi điều bạn muốn biết về di sản..."
                className="h-12"
              />
              <Button type="submit" className="h-12 px-5 bg-gradient-primary border-0 text-primary-foreground" disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>


        </div>
      </section>
    </PageLayout>
  );
};

export default AIChat;
