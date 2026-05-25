namespace HeritageAPI.Models
{
    public class HeritageItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string History { get; set; }
        public string Category { get; set; }
        public string Location { get; set; }
        public string Province { get; set; }
        public string Recognized { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public bool IsPublished { get; set; }
        public int? UserId { get; set; }
        public string? Culture { get; set; }       // Đặc điểm văn hoá / sinh thái
        public string? TicketPrice { get; set; }   // Giá vé tham quan
        public string? OpeningHours { get; set; }  // Giờ mở cửa
        public string? Activities { get; set; }    // Các hoạt động nổi bật
        public string? TravelTips { get; set; }    // Lưu ý khi du lịch
    }
}
