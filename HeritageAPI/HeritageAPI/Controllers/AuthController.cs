using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HeritageAPI.Data;
using HeritageAPI.Models;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace HeritageAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Thiếu username hoặc password");
            }

            // 1. Chỉ tìm theo Username 
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu" });
            }

            // 2. Kiểm tra mật khẩu bằng thuật toán BCrypt
            try
            {
                string dbHash = user.Password.Trim();
                string inputPass = request.Password.Trim();

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(inputPass, dbHash);
                if (!isPasswordValid)
                {
                    return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu" });
                }
            }
            catch (Exception)
            {
                // Nếu cột Password trong DB ngắn hơn 60 ký tự thì mã Hash sẽ bị lỗi đứt đoạn
                return StatusCode(500, new { message = "Lỗi Database: Cột Password quá ngắn nên mã băm bị cụt. Hãy mở SQL Server đổi cột Password sang NVARCHAR(MAX)." });
            }

            // Chặn đăng nhập nếu tài khoản bị Admin khóa
            if (user.IsLocked)
            {
                return Unauthorized(new { message = "Tài khoản của bạn đã bị khóa do vi phạm." });
            }

            // Trả về cả Role để Frontend biết là Admin hay User
            return Ok(new
            {
                message = "Đăng nhập thành công",
                user = new
                {
                    user.Id,
                    user.Username,
                    user.PhoneNumber,
                    user.Role
                }
            });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == request.Username);

            if (existingUser != null)
            {
                return BadRequest("Username đã tồn tại");
            }

            var user = new User
            {
                Username = request.Username,
                // BĂM MẬT KHẨU CHUẨN BCRYPT
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password.Trim()),
                PhoneNumber = request.PhoneNumber,
                Role = "user", // Mặc định người dùng đăng ký mới là "user"
                IsLocked = false
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký thành công" });
        }

        // show số lượng người dùng 
        [HttpGet("users/count")]
        public async Task<IActionResult> GetUserCount()
        {
            try
            {
                // Đếm tổng số lượng user trong cơ sở dữ liệu
                var count = await _context.Users.CountAsync();
                return Ok(new { count = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi đếm số lượng người dùng: " + ex.Message });
            }
        }

        // 1. API Xem danh sách toàn bộ người dùng
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Username,
                    Role = u.Role ?? "user",
                    u.IsLocked
                })
                .OrderByDescending(u => u.Id)
                .ToListAsync();
            return Ok(users);
        }

        // 2 & 4. API Khóa / Mở khóa tài khoản
        [HttpPost("users/{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(int id, [FromBody] ToggleStatusDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng" });
            }

            // Cập nhật trạng thái khóa
            user.IsLocked = dto.IsLocked;
            await _context.SaveChangesAsync();

            // Trả về thông tin user mới để Frontend cập nhật lại giao diện
            return Ok(new
            {
                user.Id,
                user.Username,
                Role = user.Role ?? "user",
                user.IsLocked
            });
        }
    }


    public class ToggleStatusDto
    {
        public bool IsLocked { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
    }
}
