import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Compass, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";



const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdown, setDropdown] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  // ✅ LOAD USER + AUTO UPDATE
  useEffect(() => {
    const loadUser = () => {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
      else setUser(null);
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // ✅ SCROLL EFFECT
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ CLICK OUTSIDE CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = () => setDropdown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const transparent = isHome && !scrolled;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  const navItems = [
    { to: "/", label: "Trang chủ" },
    { to: "/di-san", label: "Địa danh" },
    { to: "/ban-do", label: "Bản đồ" },
    { to: "/tro-ly-ai", label: "Trợ lý AI" },
  ];

  if (user) {
    navItems.push({ to: "/dong-gop", label: "Đóng góp" });
  }
  
  if (user?.role === "admin") {
    navItems.push({ to: "/quan-tri", label: "Quản trị" });
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-smooth",
        transparent ? "bg-transparent" : "glass shadow-soft"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-18 py-3">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-smooth">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div
              className={cn(
                "font-display text-lg font-bold",
                transparent ? "text-background" : "text-foreground"
              )}
            >
              Khám phá <span className="italic text-secondary">địa phương</span>
            </div>
            <div
              className={cn(
                "text-[10px] uppercase tracking-[0.2em]",
                transparent ? "text-background/70" : "text-muted-foreground"
              )}
            >
              Local Discovery
            </div>
          </div>
        </Link>

        {/* NAV */}
        <nav
          className={cn(
            "hidden lg:flex items-center gap-1 rounded-full p-1",
            transparent
              ? "bg-background/15 backdrop-blur border border-background/20"
              : "bg-muted/60"
          )}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : transparent
                    ? "text-background/85 hover:text-background"
                    : "text-foreground/70 hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 🔥 USER / LOGIN */}
        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown(!dropdown);
                }}
                className="rounded-full bg-primary text-white px-5 py-2"
              >
                👋 Xin chào, {user.username}
              </button>

              {dropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              asChild
              className="rounded-full bg-primary text-primary-foreground px-5"
            >
              <Link to="/dang-nhap">
                <LogIn className="w-4 h-4 mr-1.5" /> Đăng nhập
              </Link>
            </Button>
          )}
        </div>

        {/* MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "lg:hidden p-2 rounded-xl",
            transparent ? "text-background" : "hover:bg-muted"
          )}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <nav className="lg:hidden border-t bg-background">
          <div className="container mx-auto py-3 flex flex-col">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3"
              >
                {item.label}
              </NavLink>
            ))}

            <div className="border-t mt-2 pt-3 px-4">
              {user ? (
                <button onClick={handleLogout} className="w-full">
                  Đăng xuất
                </button>
              ) : (
                <Link to="/dang-nhap" onClick={() => setOpen(false)}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;