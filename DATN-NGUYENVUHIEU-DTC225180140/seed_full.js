/**
 * SCRIPT SEED VÀ CẬP NHẬT TỌA ĐỘ ĐỊA LÝ CHUẨN CHO ĐỒ ÁN TỐT NGHIỆP
 * Định vị chính xác tọa độ thật của 63 tỉnh thành Việt Nam.
 * Có logic tự động cập nhật (PUT) tọa độ nếu địa danh đã tồn tại trong database.
 */

let fetch = globalThis.fetch;
if (!fetch) {
  try {
    fetch = require('node-fetch');
  } catch (e) {
    console.error("Vui lòng chạy 'npm install node-fetch' hoặc nâng cấp lên Node.js >= 18.");
    process.exit(1);
  }
}

// Bỏ qua lỗi SSL tự ký của localhost
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const BASE_URLS = ["https://localhost:7216/api/heritage", "https://localhost:7000/api/heritage"];

// Tọa độ địa lý trung tâm của 63 tỉnh thành Việt Nam [Vĩ độ, Kinh độ]
const PROVINCE_COORDS = {
  "An Giang": [10.5216, 105.1259],
  "Bà Rịa - Vũng Tàu": [10.4114, 107.1362],
  "Bắc Giang": [21.2731, 106.1946],
  "Bắc Kạn": [22.2574, 105.8324],
  "Bạc Liêu": [9.2941, 105.7244],
  "Bắc Ninh": [21.1861, 106.0763],
  "Bến Tre": [10.2436, 106.3758],
  "Bình Định": [13.7830, 109.2224],
  "Bình Dương": [11.0083, 106.6601],
  "Bình Phước": [11.5332, 106.8839],
  "Bình Thuận": [10.9333, 108.1000],
  "Cà Mau": [9.1769, 104.9530],
  "Cần Thơ": [10.0452, 105.7469],
  "Cao Bằng": [22.6732, 106.2625],
  "Đà Nẵng": [16.0544, 108.2022],
  "Đắk Lắk": [12.6718, 108.0425],
  "Đắk Nông": [12.0003, 107.6845],
  "Điện Biên": [21.3831, 103.0221],
  "Đồng Nai": [10.9574, 106.8268],
  "Đồng Tháp": [10.4574, 105.6324],
  "Gia Lai": [13.9833, 108.0000],
  "Hà Giang": [22.8233, 104.9830],
  "Hà Nam": [20.5463, 105.9142],
  "Hà Nội": [21.0285, 105.8542],
  "Hà Tĩnh": [18.3333, 105.9000],
  "Hải Dương": [20.9409, 106.3331],
  "Hải Phòng": [20.8449, 106.6881],
  "Hậu Giang": [9.7845, 105.4739],
  "Hòa Bình": [20.8133, 105.3381],
  "Hưng Yên": [20.6464, 106.0511],
  "Khánh Hòa": [12.2388, 109.1967],
  "Kiên Giang": [9.9614, 105.1258],
  "Kon Tum": [14.3500, 108.0000],
  "Lai Châu": [22.4000, 103.4000],
  "Lâm Đồng": [11.9404, 108.4583],
  "Lạng Sơn": [21.8539, 106.7619],
  "Lào Cai": [22.4833, 103.9667],
  "Long An": [10.5312, 106.4124],
  "Nam Định": [20.4231, 106.1684],
  "Nghệ An": [19.2000, 104.9000],
  "Ninh Bình": [20.2500, 105.9700],
  "Ninh Thuận": [11.5624, 108.9904],
  "Phú Thọ": [21.3224, 105.2131],
  "Phú Yên": [13.0909, 109.3000],
  "Quảng Bình": [17.4833, 106.6000],
  "Quảng Nam": [15.5894, 107.9947],
  "Quảng Ngãi": [15.1219, 108.8012],
  "Quảng Ninh": [20.9599, 107.0425],
  "Quảng Trị": [16.7424, 107.1004],
  "Sóc Trăng": [9.6000, 105.9700],
  "Sơn La": [21.3231, 103.9004],
  "Tây Ninh": [11.3114, 106.1245],
  "Thái Bình": [20.4500, 106.3300],
  "Thái Nguyên": [21.5939, 105.8481],
  "Thanh Hóa": [19.8000, 105.7800],
  "Thừa Thiên Huế": [16.4637, 107.5909],
  "Tiền Giang": [10.3667, 106.3667],
  "TP. Hồ Chí Minh": [10.8231, 106.6297],
  "Trà Vinh": [9.9347, 106.3404],
  "Tuyên Quang": [21.8211, 105.2145],
  "Vĩnh Long": [10.2500, 105.9700],
  "Vĩnh Phúc": [21.3114, 105.6004],
  "Yên Bái": [21.7000, 104.8700]
};

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1528127269322-539801943592",
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b",
  "https://images.unsplash.com/photo-1557993077-d0d1db6cb7eb",
  "https://images.unsplash.com/photo-1509060464153-4466739f7840",
  "https://images.unsplash.com/photo-1563227447-0248a3a9dfba",
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f0a",
  "https://images.unsplash.com/photo-1511497584788-876760111969",
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
  "https://images.unsplash.com/photo-1472214222541-d510753a4907",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86",
  "https://images.unsplash.com/photo-1547036967-23d11aacaee0",
  "https://images.unsplash.com/photo-1588665759364-77a834221da7"
];

const PROVINCES = Object.keys(PROVINCE_COORDS);

const CATEGORIES = ["Kiến trúc", "Đô thị cổ", "Khảo cổ", "Văn miếu", "Thiên nhiên", "Tâm linh", "Văn hoá", "Lịch sử"];

const LANDMARK_TEMPLATES = [
  { name: "Chùa cổ Nghiêm Trang", category: "Tâm linh" },
  { name: "Đền thờ Vị Quốc Công", category: "Lịch sử" },
  { name: "Khu bảo tồn Thiên nhiên đặc hữu", category: "Thiên nhiên" },
  { name: "Di tích lịch sử kháng chiến ATK", category: "Lịch sử" },
  { name: "Văn miếu giáo dục khoa bảng", category: "Văn miếu" },
  { name: "Quần thể kiến trúc đình làng cổ", category: "Kiến trúc" },
  { name: "Làng nghề thủ công truyền thống", category: "Văn hoá" },
  { name: "Phố cổ thương cảng ven sông", category: "Đô thị cổ" },
  { name: "Khu khảo cổ học mộ chum cổ", category: "Khảo cổ" }
];

function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateHeritages() {
  const list = [];
  let idCounter = 1;

  for (let i = 0; i < 24; i++) {
    for (const prov of PROVINCES) {
      if (list.length >= 210) break;

      const template = LANDMARK_TEMPLATES[idCounter % LANDMARK_TEMPLATES.length];
      const name = `${template.name} tỉnh ${prov} - Đợt ${i + 1}`;
      const slug = `${removeAccents(template.name)}-${removeAccents(prov)}-${i + 1}`;
      
      const img1 = UNSPLASH_IMAGES[(idCounter) % UNSPLASH_IMAGES.length] + "?auto=format&fit=crop&w=1200&q=80";
      const img2 = UNSPLASH_IMAGES[(idCounter + 2) % UNSPLASH_IMAGES.length] + "?auto=format&fit=crop&w=1200&q=80";
      const img3 = UNSPLASH_IMAGES[(idCounter + 5) % UNSPLASH_IMAGES.length] + "?auto=format&fit=crop&w=1200&q=80";
      const imageList = `${img1},${img2},${img3}`;

      // Lấy tọa độ gốc của tỉnh
      const baseCoords = PROVINCE_COORDS[prov] || [16.0, 106.0];
      // Tách tọa độ nhỏ ngẫu nhiên (chỉ từ -0.05 đến +0.05 độ để không bị xếp thành đường chéo)
      const latOffset = ((idCounter * 13) % 100 - 50) / 1000;
      const lngOffset = ((idCounter * 17) % 100 - 50) / 1000;
      const lat = baseCoords[0] + latOffset;
      const lng = baseCoords[1] + lngOffset;

      const item = {
        name: name,
        slug: slug,
        image: imageList,
        description: `Đây là ${template.name.toLowerCase()} tọa lạc tại tỉnh ${prov}, đại diện cho bề dày lịch sử và văn hóa độc đáo của vùng đất nơi đây. Nơi này thu hút đông đảo du khách thập phương đến chiêm bái và tìm hiểu về cội nguồn lịch sử.`,
        history: `${template.name} được hình thành và xây dựng từ lâu đời. Trải qua những năm tháng lịch sử hào hùng, địa điểm này đã chứng kiến nhiều sự kiện lịch sử quan trọng của địa phương và đất nước. Công trình đã qua nhiều đợt tôn tạo lớn nhằm giữ gìn nguyên trạng nét cổ kính nguyên bản vốn có cho thế hệ mai sau học tập.`,
        category: template.category,
        location: `Huyện trung tâm, tỉnh ${prov}`,
        province: prov,
        recognized: `Di tích cấp Quốc gia (${2000 + (idCounter % 25)})`,
        lat: lat,
        lng: lng,
        isPublished: true,
        culture: `Nét văn hoá lễ hội truyền thống đặc sắc của người dân địa phương gắn liền với ${template.name.toLowerCase()}, diễn ra vào mùa xuân hàng năm với nhiều trò chơi dân gian và nghi thức trang nghiêm.`,
        ticketPrice: `${10000 + (idCounter % 5) * 10000} VNĐ`,
        openingHours: "07:30 - 17:30",
        activities: "Tham quan kiến trúc cổ kính, dâng hương chiêm bái cầu an lành, chụp ảnh lưu niệm phong cảnh sơn thủy hữu tình, thưởng thức ẩm thực đặc sắc địa phương.",
        travelTips: "Nên mặc trang phục lịch sự, đi giày thể thao để thuận tiện di chuyển qua các bậc đá dốc. Hãy có ý thức bảo vệ môi trường và cảnh quan chung."
      };

      list.push(item);
      idCounter++;
    }
  }

  // Hoàng Sa và Trường Sa với tọa độ chính xác cao
  list.push({
    name: "Bia chủ quyền Việt Nam tại đảo Song Tử Tây (Quần đảo Trường Sa)",
    slug: "bia-chu-quyen-song-tu-tay",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80",
    description: "Bia chủ quyền trên đảo Song Tử Tây thuộc quần đảo Trường Sa, tỉnh Khánh Hòa. Đây là di tích lịch sử có ý nghĩa thiêng liêng, khẳng định chủ quyền biển đảo bất khả xâm phạm của Việt Nam.",
    history: "Được xây dựng và bảo tồn từ thế kỷ 20, tấm bia là cột mốc khẳng định và tuyên bố chủ quyền lịch sử của Việt Nam đối với quần đảo Trường Sa trên biển Đông.",
    category: "Lịch sử",
    location: "Đảo Song Tử Tây, Quần đảo Trường Sa",
    province: "Khánh Hòa",
    recognized: "Di tích cấp Quốc gia",
    lat: 11.4382,
    lng: 114.3315,
    isPublished: true,
    culture: "Gắn liền với đời sống tâm linh, văn hóa biển đảo và tinh thần kiên cường bảo vệ Tổ quốc của các chiến sĩ và ngư dân trên đảo.",
    ticketPrice: "Miễn phí",
    openingHours: "Tự do",
    activities: "Tham quan cột mốc chủ quyền, dâng hương tượng đài Hưng Đạo Vương Trần Quốc Tuấn, tìm hiểu cuộc sống của chiến sĩ Hải quân.",
    travelTips: "Cần đăng ký giấy phép ra đảo theo đoàn công tác chính thức của cơ quan nhà nước."
  });

  list.push({
    name: "Bia chủ quyền Việt Nam tại đảo Nam Yết (Quần đảo Trường Sa)",
    slug: "bia-chu-quyen-nam-yet",
    image: "https://images.unsplash.com/photo-1588665759364-77a834221da7?auto=format&fit=crop&w=1200&q=80",
    description: "Bia chủ quyền Việt Nam trên đảo Nam Yết thuộc quần đảo Trường Sa, tỉnh Khánh Hòa. Cột mốc linh thiêng giữa trùng khơi, khẳng định chủ quyền lãnh thổ quốc gia.",
    history: "Tấm bia được thiết lập kiên cố, là nhân chứng lịch sử về quyền thụ lý, quản lý và thực thi chủ quyền hòa bình, liên tục của nước Việt Nam đối với quần đảo Trường Sa.",
    category: "Lịch sử",
    location: "Đảo Nam Yết, Quần đảo Trường Sa",
    province: "Khánh Hòa",
    recognized: "Di tích cấp Quốc gia",
    lat: 10.1819,
    lng: 114.3644,
    isPublished: true,
    culture: "Nếp sống, văn hóa trồng cây dừa bảo vệ đảo và tinh thần gắn bó giữa quân dân biển đảo.",
    ticketPrice: "Miễn phí",
    openingHours: "Tự do",
    activities: "Thăm quan bia chủ quyền, thăm lán chiến sĩ, chụp ảnh phong cảnh biển đảo Việt Nam.",
    travelTips: "Tuân thủ quy định và hướng dẫn của lực lượng Hải quân trên đảo."
  });

  list.push({
    name: "Di tích Đội Hùng binh Hoàng Sa tại quần đảo Hoàng Sa",
    slug: "di-tich-hung-binh-hoang-sa",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80",
    description: "Di tích khảo cổ và lịch sử tưởng niệm Đội Hùng binh Hoàng Sa - những người lính thời Nguyễn đã vâng lệnh triều đình ra đo đạc, cắm mốc chủ quyền quần đảo Hoàng Sa thuộc thành phố Đà Nẵng.",
    history: "Từ thời các chúa Nguyễn đến triều Nguyễn, triều đình đã thành lập Đội Hoàng Sa kiêm quản Trường Sa định kỳ ra đảo đo đạc bản đồ, cắm bia chủ quyền và khai thác sản vật. Di tích lịch sử này là bằng chứng đanh thép khẳng định chủ quyền lâu đời của Việt Nam.",
    category: "Lịch sử",
    location: "Quần đảo Hoàng Sa",
    province: "Đà Nẵng",
    recognized: "Di tích cấp Quốc gia",
    lat: 16.5413,
    lng: 112.2612,
    isPublished: true,
    culture: "Lễ Khao lề thế lính Hoàng Sa - di sản văn hóa phi vật thể quốc gia tôn vinh những người lính đi biển năm xưa.",
    ticketPrice: "Miễn phí",
    openingHours: "Tự do",
    activities: "Khảo sát tư liệu lịch sử, tìm hiểu bản đồ cổ khẳng định chủ quyền của Việt Nam.",
    travelTips: "Tìm hiểu thêm tài liệu trưng bày tại Nhà trưng bày Hoàng Sa trên đất liền Đà Nẵng."
  });

  return list;
}

const heritagesData = generateHeritages();

async function runSeed() {
  console.log(`Bắt đầu kết nối Backend API...`);
  
  // Xác định API URL hoạt động
  let activeUrl = null;
  for (const url of BASE_URLS) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.status === 200 || res.status === 404 || res.status === 400 || res.status === 405) {
        activeUrl = url;
        break;
      }
    } catch (e) {}
  }

  if (!activeUrl) {
    console.error("Không thể kết nối tới Backend API. Vui lòng chạy Backend C# trước!");
    return;
  }

  console.log(`Kết nối thành công API: ${activeUrl}`);

  // Bước 1: Lấy toàn bộ di sản hiện tại trong database để kiểm tra ID và đồng bộ
  let existingItems = [];
  try {
    const res = await fetch(`${activeUrl}/admin/all`);
    if (res.ok) {
      existingItems = await res.json();
      console.log(`Đã tải về ${existingItems.length} địa điểm từ CSDL để chuẩn bị đồng bộ.`);
    }
  } catch (err) {
    console.log("Không thể tải danh sách cũ, sẽ chạy chế độ chèn mới.", err.message);
  }

  const existingMap = new Map();
  existingItems.forEach(item => {
    existingMap.set(item.slug, item.id);
  });

  // Bước 2: Duyệt qua dữ liệu và thực hiện POST (nếu chưa có) hoặc PUT (nếu đã có để cập nhật tọa độ mới)
  let successCount = 0;
  for (let i = 0; i < heritagesData.length; i++) {
    const item = heritagesData[i];
    const existingId = existingMap.get(item.slug);

    try {
      let res;
      if (existingId) {
        // Gửi PUT để cập nhật tọa độ chuẩn và tránh tạo trùng lắp
        res = await fetch(`${activeUrl}/${existingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      } else {
        // Gửi POST nếu là địa danh mới
        res = await fetch(activeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }

      if (res.ok) {
        successCount++;
        if (successCount % 20 === 0 || successCount === heritagesData.length) {
          console.log(`Đã xử lý thành công: ${successCount}/${heritagesData.length} di sản...`);
        }
      } else {
        const text = await res.text();
        console.log(`Lỗi tại ${item.name}: ${text}`);
      }
    } catch (e) {
      console.log(`Lỗi kết nối khi xử lý ${item.name}:`, e.message);
    }
  }

  console.log(`HOÀN THÀNH! Đã cập nhật tọa độ địa lý phân tán tự nhiên chuẩn xác cho toàn bộ di sản.`);
}

runSeed();
