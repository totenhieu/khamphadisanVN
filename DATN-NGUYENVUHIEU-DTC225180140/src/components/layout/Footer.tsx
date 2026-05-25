import { Link } from "react-router-dom";
import { Compass, Mail, MapPin, Github, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-foreground text-background mt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="relative container mx-auto pt-20 pb-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Compass className="w-5 h-5 text-primary-foreground" strokeWidth={2.2} />
              </div>
              <span className="font-display text-xl font-bold">
                Khám phá <span className="italic text-secondary">địa phương</span>
              </span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-md">
              Đây là website giúp bạn kết nối bạn với những địa danh, di sản và câu chuyện địa phương —
              được dẫn dắt bởi trợ lý AI và bản đồ tương tác.
            </p>
            <Link to="/tro-ly-ai"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-background/10 border border-background/20 hover:bg-secondary hover:border-secondary text-sm font-medium transition-smooth">
              Bắt đầu hành trình <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-background/50 mb-5">Khám phá</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/di-san" className="text-background/80 hover:text-secondary transition-smooth">Địa danh</Link></li>
              <li><Link to="/ban-do" className="text-background/80 hover:text-secondary transition-smooth">Bản đồ tương tác</Link></li>
              <li><Link to="/tro-ly-ai" className="text-background/80 hover:text-secondary transition-smooth">Trợ lý AI</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-background/50 mb-5">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-background/80">
              <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-secondary" /> nguyenhieudzno1@gmail.com</li>
              <li className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-secondary" /> Thái Nguyên , Việt Nam</li>
              <li className="flex items-center gap-2.5"><Github className="w-4 h-4 text-secondary" /> github.com/totenhieu</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 text-xs text-background/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <span>© 2026 Khám phá di tích địa phương. Đồ án tốt nghiệp.</span>
          <span>from with love</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
