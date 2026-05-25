import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MapPin, MessageCircle, Search, Compass, Star, Quote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import HeritageCard from "@/components/HeritageCard";
import { getHeritages } from "@/services/heritageService";
import hero from "@/assets/hero-heritage.jpg";

const features = [
  {
    icon: Compass,
    title: "Khám phá có chủ đích",
    desc: "Bộ sưu tập địa danh được tuyển chọn theo chủ đề, vùng miền và trải nghiệm cá nhân.",
  },
  {
    icon: Search,
    title: "Tìm kiếm thông minh",
    desc: "Tra cứu nhanh theo tên, địa điểm, danh mục với gợi ý từ khoá theo ngữ cảnh.",
  },
  {
    icon: MessageCircle,
    title: "Trợ lý AI đồng hành",
    desc: "Trò chuyện cùng AI để được thuyết minh, gợi ý hành trình và giải đáp tức thì.",
  },
  {
    icon: MapPin,
    title: "Bản đồ tương tác",
    desc: "Xem vị trí địa danh trên bản đồ Việt Nam, click để khám phá thông tin chi tiết.",
  },
];

const testimonials = [
  {
    name: "Mai Anh",
    role: "Travel blogger",
    quote: "Một nền tảng đẹp, dễ dùng và đầy cảm hứng. Trợ lý AI giúp tôi lên kế hoạch chỉ trong vài phút.",
  },
  {
    name: "Quốc Bảo",
    role: "Sinh viên kiến trúc",
    quote: "Thông tin chuyên sâu, hình ảnh chất lượng cao — tài liệu tham khảo lý tưởng cho mọi người yêu di sản.",
  },
  {
    name: "Hồng Nhung",
    role: "Hướng dẫn viên",
    quote: "Bản đồ trực quan và mô tả dễ hiểu. Tôi giới thiệu cho khách hàng sau mỗi chuyến đi.",
  },
];

const Index = () => {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getHeritages();
        // Chỉ lấy các di sản đã xuất bản, và lấy 4 cái đầu tiên làm tiêu biểu
        const published = data.filter((h: any) => h.isPublished).slice(0, 4);
        setFeaturedItems(published);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <PageLayout withTopPadding={false}>
      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center">
        <img
          src={hero}
          alt="Khám phá địa phương Việt Nam"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />

        <div className="relative z-10 container mx-auto pt-24 pb-32">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-background text-xs uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              Khám phá di tích địa phương · Tích hợp AI
            </div>
            <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold text-background leading-[1.02] tracking-tight mb-7">
              Mỗi vùng đất là <br />
              <span className="italic text-secondary">một câu chuyện</span> riêng.
            </h1>
            <p className="text-lg md:text-xl text-background/85 max-w-xl mb-10 leading-relaxed">
              Không chỉ là địa danh – đó là câu chuyện lịch sử hào hùng của dân tộc Việt Nam
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow border-0 h-13 px-7 text-base">
                <Link to="/di-san">
                  Khám phá ngay <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full h-13 px-7 text-base bg-background/10 backdrop-blur border-background/40 text-background hover:bg-background hover:text-foreground">
                <Link to="/tro-ly-ai">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Trò chuyện AI
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Floating stats card */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-3rem)] max-w-5xl">
          <div className="glass rounded-3xl shadow-elegant p-2">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
              {[
                { num: "120+", label: "Địa danh & danh thắng" },
                { num: "63", label: "Tỉnh thành Việt Nam" },
                { num: "8", label: "Di sản UNESCO" },
                { num: "24/7", label: "AI hỗ trợ trực tuyến" },
              ].map((s) => (
                <div key={s.label} className="px-4 py-4 text-center">
                  <div className="font-display text-2xl md:text-3xl font-semibold text-primary">{s.num}</div>
                  <div className="text-[11px] md:text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-28">
        <div className="absolute inset-0 pattern-grid opacity-60" />
        <div className="relative container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-eyebrow mb-5">Tính năng</span>
            <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mb-5 mt-4">
              Một nền tảng — <span className="italic text-gradient-primary">đa trải nghiệm</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Trang web mang lại tìm kiếm thông minh và trợ lý AI để mang lại trải nghiệm khám phá toàn diện.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative p-7 rounded-3xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-elegant hover:-translate-y-1 transition-smooth animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center mb-5 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-smooth">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED HERITAGES */}
      <section className="py-28 bg-gradient-warm">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div className="max-w-xl">
              <span className="section-eyebrow mb-5">Tinh hoa</span>
              <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mt-4">
                Địa danh <span className="italic text-gradient-primary">tiêu biểu</span>
              </h2>
            </div>
            <Button asChild variant="ghost" className="rounded-full text-primary hover:bg-primary/10">
              <Link to="/di-san">
                Xem tất cả <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : featuredItems.length > 0 ? (
              featuredItems.map((h) => (
                <HeritageCard key={h.id} heritage={h} />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">
                Chưa có di sản tiêu biểu nào được xuất bản.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-eyebrow mb-5">Cảm nhận</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mt-4">
              Người dùng nói gì <span className="italic text-gradient-primary">về chúng tôi</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.name}
                className="p-7 rounded-3xl bg-card border border-border/60 hover:shadow-elegant transition-smooth animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}>
                <Quote className="w-8 h-8 text-secondary mb-4" />
                <p className="text-foreground/85 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="pb-28">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-10 md:p-16 shadow-elegant">
            <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
            <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-secondary/30 blur-3xl animate-float" />
            <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/15 backdrop-blur border border-background/20 text-primary-foreground text-xs uppercase tracking-wider mb-5">
                  <Sparkles className="w-3.5 h-3.5" /> Trợ lý AI
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mb-5 leading-[1.05]">
                  Hỏi bất cứ điều gì <br/>về <span className="italic text-secondary">địa phương Việt</span>
                </h2>
                <p className="text-primary-foreground/85 text-lg mb-8 max-w-md">
                  Trợ lý AI sẵn sàng thuyết minh, kể chuyện lịch sử và gợi ý hành trình phù hợp với bạn.
                </p>
                <Button asChild size="lg" className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-glow border-0 h-13 px-7 text-base">
                  <Link to="/tro-ly-ai">
                    Bắt đầu trò chuyện <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-secondary/30 blur-3xl animate-float" />
                  <div className="relative w-72 h-72 rounded-full glass border-background/30 flex items-center justify-center">
                    <MessageCircle className="w-32 h-32 text-secondary" strokeWidth={1.2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
