import { useEffect, useState, useMemo } from "react";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import HeritageCard from "@/components/HeritageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getHeritages } from "@/services/heritageService";

const categories = ["Tất cả", "Kiến trúc", "Lịch sử", "Đô thị cổ", "Khảo cổ", "Tâm linh", "Thiên nhiên"];

const HeritageList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Các State cho bộ lọc tổng hợp
  const [category, setCategory] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // 🔥 GỌI API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getHeritages();
        setData(res.filter((h: any) => h.isPublished));
      } catch (err) {
        console.error("Lỗi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Xử lý Lọc & Sắp xếp kết hợp
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Lọc theo Category
    if (category !== "Tất cả") {
      result = result.filter(h => h.category === category);
    }

    // 2. Lọc theo Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.name?.toLowerCase().includes(q) ||
        h.province?.toLowerCase().includes(q) ||
        h.category?.toLowerCase().includes(q) ||
        h.recognized?.toLowerCase().includes(q)
      );
    }

    // 3. Sắp xếp (Sort)
    if (sortBy === "newest") {
      // Giả sử ID lớn hơn là mới tạo (vì mảng lấy về từ DB tăng dần)
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === "featured") {
      // Ví dụ: Ưu tiên di sản đã được UNESCO công nhận làm "Nổi bật"
      result.sort((a, b) => {
        const aScore = a.recognized ? 1 : 0;
        const bScore = b.recognized ? 1 : 0;
        return bScore - aScore;
      });
    } else if (sortBy === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [data, category, searchQuery, sortBy]);

  return (
    <PageLayout>
      <section className="bg-gradient-warm py-16 border-b border-border">
        <div className="container mx-auto text-center max-w-4xl">
          <span className="section-eyebrow mb-4">Bộ sưu tập</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mt-3 mb-8">
            Khám phá <span className="italic text-gradient-primary">Di sản Việt Nam</span>
          </h1>

          {/* THANH TÌM KIẾM TỔNG HỢP (SEARCH BAR) */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, tỉnh thành, danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-12 text-base rounded-full border-border bg-card shadow-soft focus-visible:ring-primary"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* BỘ LỌC VÀ SẮP XẾP */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-2 rounded-2xl md:rounded-full border border-border shadow-sm max-w-4xl mx-auto">
            {/* Lọc danh mục (Scroll ngang trên mobile) */}
            <div className="flex overflow-x-auto w-full hide-scrollbar gap-1 px-2 py-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                    category === c
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Dropdown Sắp xếp */}
            <div className="flex items-center gap-2 pl-2 pr-4 py-1 border-t md:border-t-0 md:border-l border-border w-full md:w-auto shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] border-0 bg-transparent focus:ring-0 shadow-none font-medium">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="featured">Nổi bật</SelectItem>
                  <SelectItem value="az">Theo tên (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 min-h-[50vh]">
        <div className="container mx-auto">
          {/* TIÊU ĐỀ KẾT QUẢ */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-serif-display text-foreground">
                {category === "Tất cả" ? "Tất cả di sản" : `Danh mục: ${category}`}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Tìm thấy {processedData.length} kết quả {searchQuery && <span>cho "{searchQuery}"</span>}
              </p>
            </div>
          </div>

          {/* GRID DATA */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
              {[1,2,3,4].map(i => <div key={i} className="h-[300px] bg-muted rounded-2xl"></div>)}
            </div>
          ) : processedData.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-muted/30">
              <p className="text-lg text-muted-foreground mb-2">Không tìm thấy di sản nào phù hợp.</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setCategory("Tất cả"); }}>
                Xoá bộ lọc
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedData.map((h) => (
                <HeritageCard key={h.id} heritage={h} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default HeritageList;