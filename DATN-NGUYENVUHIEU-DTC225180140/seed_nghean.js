const heritages = [
  {
    name: "Khu di tích lịch sử Kim Liên (Quê Bác)",
    slug: "khu-di-tich-kim-lien",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?q=80&w=2000&auto=format&fit=crop,https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop,https://images.unsplash.com/photo-1582227138384-250785002130?q=80&w=2000&auto=format&fit=crop",
    description: "Là di tích quốc gia đặc biệt, quê hương của Chủ tịch Hồ Chí Minh, nơi lưu giữ những kỷ vật quý giá về tuổi thơ và gia đình của vị cha già dân tộc.",
    history: "Khu di tích bao gồm quê nội (Làng Sen) và quê ngoại (Làng Hoàng Trù) của Chủ tịch Hồ Chí Minh. Những nếp nhà tranh vách đất giản dị, hàng tre xanh mát, giếng Cốc và những kỷ vật nhuốm màu thời gian như chiếc võng gai, khung cửi, chiếc phản gỗ... tất cả đều kể câu chuyện về một gia đình Nho học yêu nước, nơi nuôi dưỡng tâm hồn vĩ nhân.\n\nĐến với Kim Liên, du khách không chỉ được chiêm ngưỡng không gian làng quê Việt Nam thanh bình mà còn cảm nhận sâu sắc những bài học về lòng yêu nước và tinh thần giản dị.",
    category: "Lịch sử",
    location: "Xã Kim Liên, Huyện Nam Đàn",
    province: "Nghệ An",
    recognized: "1979",
    lat: 18.6657,
    lng: 105.5539,
    isPublished: true
  },
  {
    name: "Đền Cuông và Núi Mộ Dạ",
    slug: "den-cuong",
    image: "https://images.unsplash.com/photo-1548625361-ec85746761f0?q=80&w=2000&auto=format&fit=crop,https://images.unsplash.com/photo-1588665759364-77a834221da7?q=80&w=2000&auto=format&fit=crop,https://images.unsplash.com/photo-1621213023259-22a00cfa1772?q=80&w=2000&auto=format&fit=crop",
    description: "Ngôi đền thiêng liêng nằm trên sườn núi Mộ Dạ, nơi thờ Thục Phán An Dương Vương, gắn liền với truyền thuyết bi tráng về chiếc nỏ thần và mối tình Mỵ Châu - Trọng Thủy.",
    history: "Theo truyền thuyết, sau khi nước Âu Lạc rơi vào tay Triệu Đà do sự phản bội của Trọng Thủy, vua Thục Phán cùng con gái Mỵ Châu chạy trốn về phương Nam. Đến bờ biển Cửa Hiền (gần núi Mộ Dạ), cùng đường nên ngài đã tự vẫn. Nhân dân xót thương lập đền Cuông để tưởng nhớ công ơn của ông.\n\nĐền mang kiến trúc cổ kính với nhiều nét chạm trổ tinh xảo, ẩn mình dưới những tán cây cổ thụ hàng trăm năm tuổi, tạo nên một không gian vô cùng u tịch và linh thiêng.",
    category: "Tâm linh",
    location: "Xã Diễn An, Huyện Diễn Châu",
    province: "Nghệ An",
    recognized: "1993",
    lat: 18.9135,
    lng: 105.5891,
    isPublished: true
  },
  {
    name: "Vườn Quốc gia Pù Mát",
    slug: "vuon-quoc-gia-pu-mat",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop,https://images.unsplash.com/photo-1543302787-8fbdfa49dbcc?q=80&w=2000&auto=format&fit=crop,https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop,https://images.unsplash.com/photo-1542385262-cea2c59530de?q=80&w=2000&auto=format&fit=crop",
    description: "Một trong những khu bảo tồn thiên nhiên lớn và quan trọng nhất Việt Nam, thuộc khu dự trữ sinh quyển thế giới Tây Nghệ An, với hệ động thực vật hoang dã vô cùng phong phú.",
    history: "Vườn quốc gia Pù Mát được thành lập năm 2001, có diện tích vùng lõi lên tới hơn 94.000 ha. Nơi đây sở hữu cảnh quan thiên nhiên kỳ vĩ với những cánh rừng nguyên sinh rậm rạp, thác nước hùng vĩ (như Thác Khe Kèm), và là ngôi nhà của nhiều loài động vật quý hiếm nằm trong Sách Đỏ như sao la, vượn má má vàng, voi châu Á.\n\nPù Mát (theo tiếng Thái nghĩa là 'Những đỉnh núi cao') không chỉ là lá phổi xanh của miền Trung mà còn là điểm đến lý tưởng cho du lịch sinh thái và khám phá.",
    category: "Thiên nhiên",
    location: "Sườn đông dãy Trường Sơn",
    province: "Nghệ An",
    recognized: "2001",
    lat: 18.9500,
    lng: 104.8167,
    isPublished: true
  }
];

async function insertData() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  for (const item of heritages) {
    try {
      const res = await fetch("https://localhost:7216/api/heritage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
      });
      if (res.ok) console.log("Thêm thành công: " + item.name);
      else console.log("Lỗi: " + item.name + " - " + await res.text());
    } catch (e) {
      console.log("Network error", e.message);
    }
  }
}
insertData();
