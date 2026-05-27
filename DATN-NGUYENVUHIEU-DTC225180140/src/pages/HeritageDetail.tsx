import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Award, Sparkles, MessageCircle, Volume2, Loader2, Info, Bookmark, Map, Clock, Banknote, TreePine, Footprints, AlertCircle } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HeritageComments from "@/components/HeritageComments";
import { getHeritageDetail } from "@/services/heritageService";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const HeritageDetail = () => {
  const { slug } = useParams();
  const [heritage, setHeritage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0); 
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        if (!slug) return;
        const data = await getHeritageDetail(slug);
        setHeritage(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-32 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (error || !heritage) {
    return (
      <PageLayout>
        <div className="container mx-auto py-32 text-center">
          <h1 className="font-serif-display text-3xl mb-4">Không tìm thấy di sản</h1>
          <Button asChild><Link to="/di-san">Về danh sách</Link></Button>
        </div>
      </PageLayout>
    );
  }

  const images = heritage.image ? heritage.image.split(',') : [];

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Bạn đang nghe thuyết minh về ${heritage.name}. ${heritage.description}. Lịch sử hình thành: ${heritage.history}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "vi-VN"; 
    utterance.rate = 0.9; 
    
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <PageLayout withTopPadding={false}>
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img 
          src={images[currentImage] || 'https://placehold.co/1920x1080?text=No+Image'} 
          alt={heritage.name} 
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500" 
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 container mx-auto h-full flex flex-col justify-end pb-12 pt-20">
          <Link to="/di-san" className="inline-flex items-center gap-2 text-background/80 hover:text-secondary text-sm mb-6 transition-smooth w-fit">
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-secondary text-secondary-foreground border-0"><Award className="w-3 h-3 mr-1" />{heritage.recognized}</Badge>
            <Badge className="bg-background/90 text-primary border-0">{heritage.category}</Badge>
          </div>
          <h1 className="font-serif-display text-4xl md:text-6xl font-bold text-background max-w-4xl leading-tight mb-4">
            {heritage.name}
          </h1>
          <div className="flex items-center gap-2 text-background/90">
            <MapPin className="w-4 h-4" />
            <span>{heritage.location}, {heritage.province}</span>
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentImage(idx)}
                  className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all ${currentImage === idx ? 'border-secondary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img 
                    src={img} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=200&q=80";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-serif-display text-3xl mb-4 text-primary flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-secondary" />
                Giới thiệu
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left">
                  {heritage.description}
                </p>
              </div>
            </div>

            {/* Hiển thị hình ảnh minh hoạ thứ 2 xen kẽ giữa nội dung */}
            {images.length > 1 && (
              <figure className="my-10 rounded-2xl overflow-hidden shadow-elegant border border-border group">
                <div className="overflow-hidden">
                  <img 
                    src={images[1]} 
                    alt={`Phong cảnh ${heritage.name}`} 
                    className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1000&q=80";
                    }}
                  />
                </div>
                <figcaption className="text-center text-sm font-medium text-muted-foreground p-4 bg-muted/30 border-t border-border">
                  Khung cảnh tuyệt đẹp tại {heritage.name}
                </figcaption>
              </figure>
            )}

            <div>
              <h2 className="font-serif-display text-3xl mb-4 text-primary">Lịch sử & Hình thành</h2>
              <div className="relative pl-6 border-l-4 border-secondary/50 rounded-l-sm bg-gradient-to-r from-secondary/5 to-transparent py-4 pr-4">
                <p className="text-foreground/85 leading-relaxed text-lg whitespace-pre-line">{heritage.history}</p>
              </div>
            </div>

            {/* Hiển thị các hình ảnh minh hoạ còn lại (nếu có) dưới dạng lưới (Grid) */}
            {images.length > 2 && (
              <div className={`grid gap-4 my-10 ${images.length > 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {images.slice(2, 4).map((img: string, idx: number) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`Góc nhìn khác của ${heritage.name}`} 
                    className="w-full h-[300px] object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow" 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                ))}
              </div>
            )}

            {heritage.culture && (
              <div>
                <h2 className="font-serif-display text-3xl mb-4 text-primary flex items-center gap-2">
                  <TreePine className="w-6 h-6 text-secondary" />
                  Đặc điểm văn hoá & Sinh thái
                </h2>
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{heritage.culture}</p>
                </div>
              </div>
            )}

            {heritage.activities && (
              <div>
                <h2 className="font-serif-display text-3xl mb-4 text-primary flex items-center gap-2">
                  <Footprints className="w-6 h-6 text-secondary" />
                  Hoạt động nổi bật
                </h2>
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{heritage.activities}</p>
                </div>
              </div>
            )}

            {heritage.travelTips && (
              <div>
                <h2 className="font-serif-display text-3xl mb-4 text-primary flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-secondary" />
                  Lưu ý khi du lịch
                </h2>
                <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-xl shadow-sm">
                  <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{heritage.travelTips}</p>
                </div>
              </div>
            )}
            <div className="rounded-2xl bg-gradient-primary p-8 shadow-elegant text-primary-foreground">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif-display text-2xl mb-2">AI thuyết minh</h3>
                  <p className="text-primary-foreground/85 mb-4">
                    Hãy để hướng dẫn viên ảo kể cho bạn nghe câu chuyện đầy đủ về {heritage.name}.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleSpeak} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0">
                      {isSpeaking ? <><Volume2 className="w-4 h-4 mr-2" /> Đang đọc...</> : <><Volume2 className="w-4 h-4 mr-2" /> Nghe thuyết minh</>}
                    </Button>
                    <Button asChild variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                      <Link to="/tro-ly-ai"><MessageCircle className="w-4 h-4 mr-2" />Hỏi AI</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <HeritageComments heritageId={heritage.id} />
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-serif-display text-xl mb-5 text-primary border-b border-border pb-3 flex items-center gap-2">
                <Info className="w-5 h-5" /> Thông tin chung
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Danh hiệu</p>
                    <p className="font-medium text-foreground leading-snug">{heritage.recognized || 'Chưa cập nhật'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Bookmark className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phân loại</p>
                    <p className="font-medium text-foreground leading-snug">{heritage.category}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Map className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tỉnh/Thành phố</p>
                    <p className="font-medium text-foreground leading-snug">{heritage.province}</p>
                  </div>
                </li>
                {heritage.ticketPrice && (
                  <li className="flex items-start gap-3">
                    <Banknote className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Giá vé</p>
                      <p className="font-medium text-foreground leading-snug">{heritage.ticketPrice}</p>
                    </div>
                  </li>
                )}
                {heritage.openingHours && (
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Giờ mở cửa</p>
                      <p className="font-medium text-foreground leading-snug">{heritage.openingHours}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-serif-display text-xl mb-4 text-primary border-b border-border pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Vị trí trên bản đồ
              </h3>
              <div className="aspect-square rounded-lg bg-muted overflow-hidden mb-3 relative z-0">
                {heritage.lat && heritage.lng ? (
                  <MapContainer 
                    center={[heritage.lat, heritage.lng]} 
                    zoom={13} 
                    className="w-full h-full"
                    scrollWheelZoom={false}
                    zoomControl={false}
                    attributionControl={false}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    <Marker 
                      position={[heritage.lat, heritage.lng]} 
                      icon={new L.Icon({
                        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                      })} 
                    />
                  </MapContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Chưa có toạ độ
                  </div>
                )}
              </div>
              <p className="text-sm text-foreground/90 font-medium mt-3 bg-muted p-3 rounded-lg flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-secondary mt-0.5" />
                <span>{heritage.location}, {heritage.province}</span>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
};

export default HeritageDetail;