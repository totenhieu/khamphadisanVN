using Microsoft.AspNetCore.Mvc;
using HeritageAPI.Data;
using HeritageAPI.Models;
using System.IO;
using System.Linq;
using System;
using System.Threading.Tasks;

namespace HeritageAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HeritageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HeritageController(AppDbContext context)
        {
            _context = context;
        }

        //  1. GET LIST (DÀNH CHO NGƯỜI DÙNG THƯỜNG - CHỈ LẤY BÀI ĐÃ DUYỆT)
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.HeritageItems
                .Where(x => x.IsPublished == true)
                .OrderByDescending(x => x.Id)
                .ToList();
            return Ok(data);
        }

        //  1.1 GET ALL FOR ADMIN
        [HttpGet("admin/all")]
        public IActionResult GetAllForAdmin()
        {
            var data = _context.HeritageItems.OrderByDescending(x => x.Id).ToList();
            return Ok(data);
        }

        //  1.2 MỚI: LẤY BÀI VIẾT THEO USER ID (Cho trang Đóng góp)
        [HttpGet("user/{userId}")]
        public IActionResult GetByUser(int userId)
        {
            var data = _context.HeritageItems
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.Id)
                .ToList();
            return Ok(data);
        }

        // 2. GET DETAIL BY SLUG
        [HttpGet("{slug}")]
        public IActionResult GetBySlug(string slug)
        {
            var item = _context.HeritageItems.FirstOrDefault(x => x.Slug == slug);

            if (item == null)
                return NotFound("Không tìm thấy di sản");

            return Ok(item);
        }

        //  3. CREATE 
        [HttpPost]
        public IActionResult Create([FromBody] HeritageItem item)
        {
            if (string.IsNullOrEmpty(item.Name) || string.IsNullOrEmpty(item.Slug))
            {
                return BadRequest("Thiếu Name hoặc Slug");
            }

            var exists = _context.HeritageItems.Any(x => x.Slug == item.Slug);
            if (exists)
            {
                return BadRequest("Slug đã tồn tại");
            }

            // Tự động duyệt bài viết trực tiếp nếu là Admin thêm bài
            if (item.UserId == null || item.UserId == 0)
            {
                item.IsPublished = true; // Admin thêm trực tiếp từ trang quản trị
            }
            else
            {
                var user = _context.Users.FirstOrDefault(u => u.Id == item.UserId);
                if (user != null && (user.Role == "Admin" || user.Role == "admin"))
                {
                    item.IsPublished = true;
                }
                else
                {
                    item.IsPublished = false; // User thường đóng góp thì cần phê duyệt
                }
            }

            _context.HeritageItems.Add(item);
            _context.SaveChanges();

            return Ok(item);
        }

        // 4. UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] HeritageItem updated)
        {
            var item = _context.HeritageItems.FirstOrDefault(x => x.Id == id);

            if (item == null)
                return NotFound("Không tìm thấy di sản để cập nhật");

            item.Name = updated.Name;
            item.Slug = updated.Slug;
            item.Image = updated.Image;
            item.Description = updated.Description;
            item.History = updated.History;
            item.Category = updated.Category;
            item.Location = updated.Location;
            item.Province = updated.Province;
            item.Recognized = updated.Recognized;
            item.Lat = updated.Lat;
            item.Lng = updated.Lng;
            item.Culture = updated.Culture;
            item.TicketPrice = updated.TicketPrice;
            item.OpeningHours = updated.OpeningHours;
            item.Activities = updated.Activities;
            item.TravelTips = updated.TravelTips;

            // Xác định quyền duyệt trực tiếp
            if (updated.UserId == null || updated.UserId == 0)
            {
                item.IsPublished = true; // Admin sửa đổi thì tự động duyệt trực tiếp
            }
            else
            {
                var user = _context.Users.FirstOrDefault(u => u.Id == updated.UserId);
                if (user != null && (user.Role == "Admin" || user.Role == "admin"))
                {
                    item.IsPublished = true;
                }
                else
                {
                    item.IsPublished = false; // Người dùng thường sửa thì cần phê duyệt lại
                }

                item.UserId = updated.UserId; // Chỉ cập nhật UserId nếu có thông tin hợp lệ gửi lên
            }

            _context.SaveChanges();
            return Ok(item);
        }

        //  4.1 APPROVE
        [HttpPut("{id}/approve")]
        public IActionResult Approve(int id)
        {
            var item = _context.HeritageItems.FirstOrDefault(x => x.Id == id);

            if (item == null)
                return NotFound("Không tìm thấy di sản");

            item.IsPublished = true;
            _context.SaveChanges();

            return Ok(new { message = "Đã duyệt bài viết thành công" });
        }

        //  5. DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.HeritageItems.Find(id);

            if (item == null)
                return NotFound("Không tìm thấy di sản");

            _context.HeritageItems.Remove(item);
            _context.SaveChanges();

            return Ok(new { message = "Đã xoá thành công" });
        }

        //  6. UPLOAD ẢNH
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(Microsoft.AspNetCore.Http.IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Không có file tải lên");

            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var path = Path.Combine(folder, fileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var request = HttpContext.Request;
            var url = $"{request.Scheme}://{request.Host}/images/{fileName}";

            return Ok(new { url });
        }
    }
}
