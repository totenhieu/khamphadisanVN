import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Loader2 } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { getHeritages } from "@/services/heritageService";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon to avoid the default broken image issue in Leaflet + React
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to fly to the selected heritage
const MapUpdater = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 9, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const MapPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getHeritages();
        const published = data.filter((h: any) => h.isPublished);
        setItems(published);
        if (published.length > 0) {
          const idFromUrl = searchParams.get('id');
          if (idFromUrl) {
            const found = published.find((h: any) => h.id.toString() === idFromUrl);
            setSelected(found || published[0]);
          } else {
            setSelected(published[0]);
          }
        }
      } catch (err) {
        console.error("Lỗi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <PageLayout>
      <section className="bg-gradient-warm py-12 border-b border-border">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="heritage-divider"><span className="text-xs uppercase tracking-widest">Bản đồ</span></div>
          <h1 className="font-serif-display text-5xl font-bold mb-3">
            Di sản trên <span className="text-gradient-primary italic">khắp Việt Nam</span>
          </h1>
          <p className="text-muted-foreground">Click vào điểm đánh dấu để xem chi tiết di sản.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2 relative aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card shadow-soft z-0">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <MapContainer 
                center={[16.0, 106.0]} 
                zoom={5} 
                className="w-full h-full"
                scrollWheelZoom={true}
                attributionControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {items.map((h) => {
                  if (!h.lat || !h.lng) return null;
                  const isHoangSa = h.name.includes("Hoàng Sa") || h.province?.includes("Hoàng Sa") || h.location?.includes("Hoàng Sa");
                  const isTruongSa = h.name.includes("Trường Sa") || h.province?.includes("Trường Sa") || h.location?.includes("Trường Sa");
                  
                  return (
                    <Marker 
                      key={h.id} 
                      position={[h.lat, h.lng]} 
                      icon={customIcon}
                      eventHandlers={{
                        click: () => setSelected(h),
                      }}
                    >
                      <Popup className="font-sans">
                        <div className="font-semibold text-primary mb-1">{h.name}</div>
                        <div className="text-xs text-muted-foreground">{h.province}</div>
                      </Popup>
                      {(isHoangSa || isTruongSa) && (
                        <Tooltip 
                          permanent 
                          direction="top" 
                          offset={[0, -20]}
                          className="bg-red-50 text-red-600 font-bold border border-red-300 px-2 py-1 rounded shadow-md text-[11px]"
                        >
                          {isHoangSa ? "Quần đảo Hoàng Sa (Việt Nam)" : "Quần đảo Trường Sa (Việt Nam)"}
                        </Tooltip>
                      )}
                    </Marker>
                  );
                })}
                <MapUpdater center={selected?.lat && selected?.lng ? [selected.lat, selected.lng] : null} />
              </MapContainer>
            )}
          </div>

          {/* Side panel */}
          <aside className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : selected ? (
              <>
                <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-soft">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={selected.image?.split(',')[0] || 'https://placehold.co/600x400?text=No+Image'} 
                      alt={selected.name} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <Badge className="bg-secondary text-secondary-foreground border-0 mb-2">{selected.recognized}</Badge>
                    <h3 className="font-serif-display text-2xl mb-1">{selected.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5" /> {selected.province}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{selected.description}</p>
                    <Link to={`/di-san/${selected.slug}`} className="text-sm font-semibold text-primary hover:underline">
                      Xem chi tiết →
                    </Link>
                  </div>
                </div>
                <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
                  <h4 className="font-serif-display text-lg mb-3">Tất cả địa điểm</h4>
                  <ul className="space-y-1 h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((h) => (
                      <li key={h.id}>
                        <button
                          onClick={() => setSelected(h)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-smooth ${selected.id === h.id ? "bg-accent text-primary font-semibold" : "hover:bg-accent/50"}`}
                        >
                          {h.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="p-5 text-center text-muted-foreground">Không có dữ liệu.</div>
            )}
          </aside>
        </div>
      </section>
    </PageLayout>
  );
};

export default MapPage;
