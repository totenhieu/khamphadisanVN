import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, Clock, Users, FileText, Eye, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getHeritagesForAdmin, createHeritage, deleteHeritage, uploadImage, updateHeritage, approveHeritage } from "@/services/heritageService";
import { getUserCountApi, getAllUsersApi, toggleUserStatusApi } from "@/services/authService";
import { Lock, Unlock } from "lucide-react";



const categories: string[] = ["Kiến trúc", "Lịch sử", "Đô thị cổ", "Khảo cổ", "Tâm linh", "Thiên nhiên", "Văn miếu"];

type HeritageForm = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  history: string;
  category: string;
  location: string;
  province: string;
  recognized: string;
  lat: string;
  lng: string;
  culture?: string;
  ticketPrice?: string;
  openingHours?: string;
  activities?: string;
  travelTips?: string;
};

const emptyForm: HeritageForm = {
  id: "",
  name: "",
  slug: "",
  image: "",
  description: "",
  history: "",
  category: "Kiến trúc",
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
};

const Admin = () => {
  const [tab, setTab] = useState<"posts" | "review" | "users">("posts");
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<HeritageForm>(emptyForm);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [userCount, setUserCount] = useState<number | string>("N/A");
  const [usersList, setUsersList] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadImage(files[i]);
        if (res.url || res.imageUrl) {
          newUrls.push(res.url || res.imageUrl);
        }
      }
      
      setForm((p) => {
        const currentImages = p.image ? p.image.split(',').map(s => s.trim()).filter(Boolean) : [];
        const updatedImages = [...currentImages, ...newUrls].join(',');
        return { ...p, image: updatedImages };
      });

      toast({ title: "Tải ảnh thành công" });
    } catch (error: any) {
      toast({ title: "Lỗi tải ảnh", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getHeritagesForAdmin();
        setItems(data);
        
        const count = await getUserCountApi();
        setUserCount(count);

        try {
          const users = await getAllUsersApi();
          setUsersList(users);
        } catch (err) {
          console.error("Could not fetch users", err);
        }
      } catch (error: any) {
        toast({ title: "Lỗi tải dữ liệu", description: error.message, variant: "destructive" });
      }
    };
    fetchAll();
  }, [toast]);

  const updateField = <K extends keyof HeritageForm>(key: K, value: HeritageForm[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập tên và slug.", variant: "destructive" });
      return;
    }
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      toast({ title: "Toạ độ không hợp lệ", description: "Lat/Lng phải là số.", variant: "destructive" });
      return;
    }
    
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
        history: form.history.trim(),
        category: form.category,
        location: form.location.trim(),
        province: form.province.trim(),
        recognized: form.recognized.trim(),
        lat: lat,
        lng: lng,
        culture: form.culture?.trim() || "",
        ticketPrice: form.ticketPrice?.trim() || "",
        openingHours: form.openingHours?.trim() || "",
        activities: form.activities?.trim() || "",
        travelTips: form.travelTips?.trim() || "",
      };
      
      if (editingId) {
        const updated = await updateHeritage(editingId, payload);
        setItems((p) => p.map(x => x.id === editingId ? updated : x));
        toast({ title: "Đã cập nhật di sản", description: updated.name });
      } else {
        let newHeritage = await createHeritage(payload);
        
        // Tự động duyệt di sản vì admin là người thêm trực tiếp
        try {
          await approveHeritage(newHeritage.id);
          newHeritage.isPublished = true;
        } catch (e) {
          console.error("Lỗi tự động duyệt di sản:", e);
        }

        setItems((p) => [newHeritage, ...p]);
        toast({ title: "Đã thêm di sản", description: newHeritage.name });
      }
      setForm(emptyForm);
      setEditingId(null);
      setOpen(false);
    } catch (error: any) {
      toast({ title: "Lỗi lưu dữ liệu", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      id: item.id?.toString() || "",
      name: item.name || "",
      slug: item.slug || "",
      image: item.image || "",
      description: item.description || "",
      history: item.history || "",
      category: item.category || "Kiến trúc",
      location: item.location || "",
      province: item.province || "",
      recognized: item.recognized || "",
      lat: item.lat?.toString() || "",
      lng: item.lng?.toString() || "",
      culture: item.culture || "",
      ticketPrice: item.ticketPrice || "",
      openingHours: item.openingHours || "",
      activities: item.activities || "",
      travelTips: item.travelTips || "",
    });
    setEditingId(item.id);
    setOpen(true);
  };

  const handlePublish = async (item: any) => {
    try {
      await approveHeritage(item.id);
      const updated = { ...item, isPublished: true };
      setItems((p) => p.map(x => x.id === item.id ? updated : x));
      toast({ title: "Đã duyệt bài", description: item.name });
    } catch (error: any) {
      toast({ title: "Lỗi duyệt bài", description: error.message, variant: "destructive" });
    }
  };

  const filteredItems = items.filter(h => 
    h.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.province?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá bài viết này không? Hành động này không thể hoàn tác!")) {
      return;
    }

    try {
      await deleteHeritage(id);
      setItems((p) => p.filter((h) => h.id !== id));
      toast({ title: "Đã xoá di sản" });
    } catch (error: any) {
      toast({ title: "Lỗi xoá dữ liệu", description: error.message, variant: "destructive" });
    }
  };

  const imageCount = items.reduce((sum, item) => {
    if (!item.image) return sum;
    const count = item.image.split(',').map((s: string) => s.trim()).filter(Boolean).length;
    return sum + count;
  }, 0);

  return (
    <PageLayout>


      <section className="container mx-auto py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Tổng bài viết", value: items.length, icon: FileText, color: "from-primary to-primary-glow" },
            { label: "Chờ duyệt", value: items.filter((x: any) => !x.isPublished).length, icon: Clock, color: "from-secondary to-secondary" },
            { label: "Đã xuất bản", value: items.filter((x: any) => x.isPublished).length, icon: CheckCircle2, color: "from-emerald-600 to-emerald-500" },
            { label: "Hình ảnh", value: imageCount, icon: ImageIcon, color: "from-amber-700 to-amber-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-serif-display font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {[
            { id: "posts", label: "Bài viết di sản" },
            { id: "review", label: "Chờ duyệt" },
            { id: "users", label: "Người dùng" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-smooth ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-serif-display text-xl">Danh sách bài viết</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Tìm kiếm theo tên/tỉnh..." 
                  value={searchQuery} 
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                  className="w-64"
                />
                <Button
                  onClick={() => { setForm(emptyForm); setEditingId(null); setOpen(true); }}
                  className="bg-gradient-primary border-0 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-1" />Thêm di sản
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Ảnh</th>
                    <th className="px-5 py-3 font-medium">Tên di sản</th>
                    <th className="px-5 py-3 font-medium">Danh mục</th>
                    <th className="px-5 py-3 font-medium">Tỉnh thành</th>
                    <th className="px-5 py-3 font-medium">Trạng thái</th>
                    <th className="px-5 py-3 font-medium text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((h, i) => (
                    <tr key={h.id} className="border-t border-border hover:bg-accent/30 transition-smooth">
                      <td className="px-5 py-3">
                        <img 
                          src={h.image ? h.image.split(',')[0].trim() : "https://placehold.co/100?text=No+Image"} 
                          alt="" 
                          className="w-12 h-12 rounded-md object-cover" 
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=200&q=80";
                          }}
                        />
                      </td>
                      <td className="px-5 py-3 font-medium">{h.name}</td>
                      <td className="px-5 py-3">{h.category}</td>
                      <td className="px-5 py-3 text-muted-foreground">{h.province}</td>
                      <td className="px-5 py-3">
                        <Badge className={!h.isPublished ? "bg-secondary/20 text-secondary border-0" : "bg-emerald-100 text-emerald-700 border-0 dark:bg-emerald-900/30 dark:text-emerald-400"}>
                          {!h.isPublished ? "Chờ duyệt" : "Đã xuất bản"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => window.open(`/di-san/${h.slug}`, '_blank')} title="Xem bài viết">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(h)} title="Sửa bài viết">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(h.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-end p-4 border-t border-border gap-2 bg-muted/20">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Trước</Button>
                <div className="flex items-center px-2 text-sm">Trang {currentPage} / {totalPages}</div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Sau</Button>
              </div>
            )}
          </div>
        )}

        {tab === "review" && (
          <div className="grid md:grid-cols-2 gap-4">
            {items.filter(h => !h.isPublished).map((h) => (
              <div key={h.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
                <img 
                  src={h.image ? h.image.split(',')[0].trim() : "https://placehold.co/400x200?text=No+Image"} 
                  alt="" 
                  className="w-full h-40 object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="p-5">
                  <Badge className="bg-secondary/20 text-secondary border-0 mb-2">Chờ duyệt</Badge>
                  <h4 className="font-serif-display text-xl mb-1">{h.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{h.description}</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1" onClick={() => window.open(`/di-san/${h.slug}`, '_blank')} title="Xem chi tiết bài viết">
                      <Eye className="w-4 h-4 mr-1" />Xem
                    </Button>
                    <Button onClick={() => handlePublish(h)} className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 flex-1">
                      <CheckCircle2 className="w-4 h-4 mr-1" />Duyệt
                    </Button>
                    <Button variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={() => handleDelete(h.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />Từ chối
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {items.filter(h => !h.isPublished).length === 0 && (
              <div className="col-span-2 text-center text-muted-foreground p-8">Không có bài viết nào đang chờ duyệt.</div>
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-serif-display text-xl">Danh sách người dùng</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Tìm kiếm theo tên đăng nhập..." 
                  value={userSearchQuery} 
                  onChange={(e) => setUserSearchQuery(e.target.value)} 
                  className="w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 font-medium">Tên đăng nhập</th>
                    <th className="px-5 py-3 font-medium">Vai trò</th>
                    <th className="px-5 py-3 font-medium">Trạng thái</th>
                    <th className="px-5 py-3 font-medium text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList
                    .filter(u => u.username?.toLowerCase().includes(userSearchQuery.toLowerCase()))
                    .map((u) => {
                      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                      const isSelf = u.id === currentUser.id;
                      const isAdmin = u.role?.toLowerCase() === "admin";
                      const canToggle = !isSelf && !isAdmin;

                      return (
                    <tr key={u.id} className="border-t border-border hover:bg-accent/30 transition-smooth">
                      <td className="px-5 py-3 font-medium text-muted-foreground">#{u.id}</td>
                      <td className="px-5 py-3 font-medium">{u.username}</td>
                      <td className="px-5 py-3">
                        <Badge className={u.role === "Admin" ? "bg-amber-100 text-amber-700 border-0 dark:bg-amber-900/30 dark:text-amber-400" : "bg-secondary/20 text-secondary border-0"}>
                          {u.role || "Member"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge className={u.isLocked ? "bg-destructive/20 text-destructive border-0" : "bg-emerald-100 text-emerald-700 border-0 dark:bg-emerald-900/30 dark:text-emerald-400"}>
                          {u.isLocked ? "Đã khóa" : "Hoạt động"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={!canToggle}
                          className={u.isLocked ? "text-emerald-600 hover:text-emerald-700" : "text-destructive hover:text-destructive"}
                          onClick={async () => {
                            if (!canToggle) return;
                            try {
                              const updated = await toggleUserStatusApi(u.id, !u.isLocked);
                              setUsersList(usersList.map(user => user.id === u.id ? updated : user));
                              toast({ title: u.isLocked ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản", description: u.username });
                            } catch (err: any) {
                              toast({ title: "Lỗi", description: err.message, variant: "destructive" });
                            }
                          }}
                        >
                          {u.isLocked ? <><Unlock className="w-4 h-4 mr-1" /> Mở khóa</> : <><Lock className="w-4 h-4 mr-1" /> Khóa</>}
                        </Button>
                      </td>
                    </tr>
                  )})}
                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-muted-foreground">
                        Không có dữ liệu người dùng. (Kiểm tra lại Backend API)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif-display text-2xl">{editingId ? "Cập nhật di sản" : "Thêm di sản mới"}</DialogTitle>
            <DialogDescription>Nhập đầy đủ thông tin di sản. Dữ liệu chỉ lưu tạm trên trình duyệt.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Id</Label>
                <Input id="id" value={form.id} onChange={(e) => updateField("id", e.target.value)} placeholder="Tự sinh nếu để trống" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required maxLength={150} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required placeholder="vi-du-slug" maxLength={150} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                  <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recognized">Recognized</Label>
                <Input id="recognized" value={form.recognized} onChange={(e) => updateField("recognized", e.target.value)} placeholder="UNESCO 1999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input id="province" value={form.province} onChange={(e) => updateField("province", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lat">Lat</Label>
                <Input id="lat" type="number" step="any" value={form.lat} onChange={(e) => updateField("lat", e.target.value)} placeholder="16.4698" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Lng</Label>
                <Input id="lng" type="number" step="any" value={form.lng} onChange={(e) => updateField("lng", e.target.value)} placeholder="107.5793" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images (URL hoặc Tải lên)</Label>
              <p className="text-xs text-muted-foreground mb-2">Bạn có thể dán link trực tiếp hoặc upload nhiều ảnh cùng lúc.</p>
              
              <Input value={form.image} onChange={e => updateField("image", e.target.value)} placeholder="Nhập link ảnh https://... (nếu không upload)" className="mb-2" />
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center relative bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="text-center space-y-2">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-muted-foreground mx-auto animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  )}
                  <div className="text-sm font-medium">{isUploading ? "Đang tải ảnh..." : "Click để chọn nhiều ảnh upload"}</div>
                </div>
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
              </div>

              {/* HIỂN THỊ CÁC ẢNH ĐÃ CHỌN */}
              {form.image && form.image.trim() !== "" && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                  {form.image.split(',').map(s => s.trim()).filter(Boolean).map((url, idx) => (
                    <div key={idx} className="relative group rounded-md overflow-hidden aspect-video">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => {
                          const currentImages = form.image.split(',').map(s => s.trim()).filter(Boolean);
                          currentImages.splice(idx, 1);
                          updateField("image", currentImages.join(','));
                        }}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Giới thiệu)</Label>
              <Textarea id="description" value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} maxLength={1000} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="history">History (Lịch sử)</Label>
              <Textarea id="history" value={form.history} onChange={(e) => updateField("history", e.target.value)} rows={3} maxLength={1000} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Ticket Price (Giá vé)</Label>
                <Input id="ticketPrice" value={form.ticketPrice} onChange={(e) => updateField("ticketPrice", e.target.value)} placeholder="VD: Miễn phí / 50.000 VNĐ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingHours">Opening Hours (Giờ mở cửa)</Label>
                <Input id="openingHours" value={form.openingHours} onChange={(e) => updateField("openingHours", e.target.value)} placeholder="VD: 07:00 - 17:00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="culture">Culture (Văn hoá / Sinh thái)</Label>
              <Textarea id="culture" value={form.culture} onChange={(e) => updateField("culture", e.target.value)} rows={2} placeholder="Đặc điểm văn hoá, động thực vật..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activities">Activities (Hoạt động)</Label>
              <Textarea id="activities" value={form.activities} onChange={(e) => updateField("activities", e.target.value)} rows={2} placeholder="Các hoạt động du lịch nổi bật..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelTips">Travel Tips (Lưu ý)</Label>
              <Textarea id="travelTips" value={form.travelTips} onChange={(e) => updateField("travelTips", e.target.value)} rows={2} placeholder="Mùa đẹp nhất, trang phục..." />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Huỷ</Button>
              <Button type="submit" className="bg-gradient-primary border-0 text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" />{editingId ? "Lưu thay đổi" : "Thêm di sản"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Admin;
