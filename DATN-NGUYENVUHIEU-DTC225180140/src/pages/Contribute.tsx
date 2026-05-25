import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin, Loader2, ArrowLeft, X, Image as ImageIcon } from "lucide-react";
import { createHeritage, uploadImage, getHeritagesByUser } from "@/services/heritageService";
import PageLayout from "@/components/layout/PageLayout";

const Contribute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "", // Giữ lại lỡ user muốn dán link ảnh
    description: "",
    history: "",
    category: "",
    location: "",
    province: "",
    recognized: "",
    lat: "",
    lng: "",
    culture: "",
    ticketPrice: "",
    openingHours: "",
    activities: "",
    travelTips: "",
  });

  const loadMyPosts = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const data = await getHeritagesByUser(user.id);
      setMyPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      toast({ title: "Đang upload ảnh..." });
      
      const newUrls = [...imageUrls];
      // Upload từng file một
      for (let i = 0; i < files.length; i++) {
        const res = await uploadImage(files[i]);
        if (res.url || res.imageUrl) {
          newUrls.push(res.url || res.imageUrl);
        }
      }
      
      setImageUrls(newUrls);
      toast({ title: "Upload thành công!" });
    } catch (error: any) {
      toast({ title: "Lỗi upload", description: error.message, variant: "destructive" });
    }
  };

  const removeImage = (index: number) => {
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
        location: formData.location,
        province: formData.province,
        category: formData.category,
        description: formData.description,
        history: formData.history,
        recognized: formData.recognized,
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
        culture: formData.culture,
        ticketPrice: formData.ticketPrice,
        openingHours: formData.openingHours,
        activities: formData.activities,
        travelTips: formData.travelTips,
        image: imageUrls.length > 0 ? imageUrls.join(",") : formData.image,
        userId: user?.id || null
      };

      await createHeritage(payload);
      toast({ title: "Đóng góp thành công!", description: "Bài viết của bạn đang chờ Admin duyệt." });
      
      // Reset form
      setFormData({
        name: "",
        slug: "",
        image: "",
        description: "",
        history: "",
        category: "",
        location: "",
        province: "",
        recognized: "",
        lat: "",
        lng: "",
        culture: "",
        ticketPrice: "",
        openingHours: "",
        activities: "",
        travelTips: "",
      });
      setImageUrls([]);
      
      // Reload danh sách bài
      loadMyPosts();
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-5xl py-12 mx-auto">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 -ml-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ
      </Button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* CỘT 1: FORM ĐÓNG GÓP */}
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Đóng góp di sản</h1>
            <p className="text-muted-foreground">Chia sẻ thông tin về các di sản tại địa phương của bạn. Bài viết sẽ được kiểm duyệt trước khi hiển thị.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input required id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} maxLength={150} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="Tự sinh nếu để trống" maxLength={150} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input required id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Ví dụ: Văn hóa, Kiến trúc..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recognized">Recognized *</Label>
                <Input required id="recognized" value={formData.recognized} onChange={e => setFormData({ ...formData, recognized: e.target.value })} placeholder="Ví dụ: UNESCO 1999" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input required id="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Input required id="province" value={formData.province} onChange={e => setFormData({ ...formData, province: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lat">Lat</Label>
                <Input id="lat" type="number" step="any" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} placeholder="16.4698" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Lng</Label>
                <Input id="lng" type="number" step="any" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} placeholder="107.5793" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea required id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} maxLength={1000} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="history">History *</Label>
              <Textarea required id="history" value={formData.history} onChange={e => setFormData({ ...formData, history: e.target.value })} rows={4} maxLength={2000} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Ticket Price (Giá vé)</Label>
                <Input id="ticketPrice" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} placeholder="VD: Miễn phí / 50.000 VNĐ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingHours">Opening Hours (Giờ mở cửa)</Label>
                <Input id="openingHours" value={formData.openingHours} onChange={e => setFormData({ ...formData, openingHours: e.target.value })} placeholder="VD: 07:00 - 17:00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="culture">Culture (Đặc điểm văn hoá & sinh thái)</Label>
              <Textarea id="culture" value={formData.culture} onChange={e => setFormData({ ...formData, culture: e.target.value })} rows={2} placeholder="Văn hoá, con người, động thực vật..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activities">Activities (Hoạt động nổi bật)</Label>
              <Textarea id="activities" value={formData.activities} onChange={e => setFormData({ ...formData, activities: e.target.value })} rows={2} placeholder="Du khách có thể làm gì ở đây?..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelTips">Travel Tips (Lưu ý khi du lịch)</Label>
              <Textarea id="travelTips" value={formData.travelTips} onChange={e => setFormData({ ...formData, travelTips: e.target.value })} rows={2} placeholder="Nên đi mùa nào, mặc gì..." />
            </div>

            <div className="space-y-2">
              <Label>Images (URL hoặc Tải lên) <span className="text-destructive">*</span></Label>
              <p className="text-xs text-muted-foreground mb-2">Bạn có thể dán link trực tiếp hoặc upload nhiều ảnh cùng lúc.</p>
              
              <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="Nhập link ảnh https://... (nếu không upload)" className="mb-2" />
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center relative bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="text-center space-y-2">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  <div className="text-sm font-medium">Click để chọn nhiều ảnh upload</div>
                </div>
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
              </div>

              {/* HIỂN THỊ CÁC ẢNH ĐÃ CHỌN */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative group rounded-md overflow-hidden aspect-video">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button disabled={submitting} type="submit" className="min-w-[150px]">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Gửi bài viết
              </Button>
            </div>
          </form>
        </div>

        {/* CỘT 2: LỊCH SỬ ĐÓNG GÓP */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Lịch sử đóng góp của bạn</h2>
            <p className="text-muted-foreground">Theo dõi trạng thái các bài viết bạn đã gửi lên hệ thống.</p>
          </div>

          {loadingPosts ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : myPosts.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-10 text-center flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>Bạn chưa đóng góp di sản nào.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {myPosts.map(post => {
                // Lấy ảnh đầu tiên nếu có nhiều ảnh
                const firstImage = post.image?.split(',')[0] || '';
                
                return (
                  <div key={post.id} className="flex gap-4 bg-card border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <img src={firstImage || 'https://placehold.co/100x100?text=No+Image'} alt="" className="w-24 h-24 rounded-lg object-cover bg-muted" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">{post.name}</h3>
                        <Badge variant={post.isPublished ? "default" : "secondary"} className={post.isPublished ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                          {post.isPublished ? "Đã duyệt" : "Chờ duyệt"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.description || post.shortDescription}</p>
                      <div className="mt-2 text-xs text-muted-foreground flex gap-3">
                        <span>Danh mục: {post.category}</span>
                        <span>{post.image?.split(',').length || 0} hình ảnh</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </div>
    </PageLayout>
  );
};

export default Contribute;
