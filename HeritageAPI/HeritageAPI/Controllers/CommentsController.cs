using Microsoft.AspNetCore.Mvc;
using HeritageAPI.Data;
using HeritageAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace HeritageAPI.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context; 

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/comments/heritage/{id}
        [HttpGet("heritage/{id}")]
        public async Task<IActionResult> GetCommentsByHeritage(int id)
        {
            var comments = await _context.Comments
                .Include(c => c.User) // Join bảng User để lấy Tên
                .Where(c => c.HeritageId == id)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.HeritageId,
                    c.UserId,
                    Username = c.User.Username, // Lấy username từ bảng User
                    c.Content,
                    c.CreatedAt
                })
                .ToListAsync();

            return Ok(comments);
        }

        // POST: api/comments
        [HttpPost]
        public async Task<IActionResult> PostComment([FromBody] CommentCreateDto request)
        {
            // Validation cơ bản (bảo mật lớp 2 ở server)
            if (string.IsNullOrWhiteSpace(request.Content))
                return BadRequest("Nội dung không được để trống.");

            if (request.Content.Length > 150)
                return BadRequest("Bình luận không được vượt quá 150 ký tự.");

            if (request.Content.Trim().Length <= 5)
                return BadRequest("Bình luận phải có nhiều hơn 5 ký tự.");

            var comment = new Comment
            {
                HeritageId = request.HeritageId,
                UserId = request.UserId,
                Content = request.Content,
                CreatedAt = DateTime.Now
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            // Lấy lại username để trả về cho Frontend hiển thị ngay lập tức
            var user = await _context.Users.FindAsync(request.UserId);

            return Ok(new
            {
                comment.Id,
                comment.HeritageId,
                comment.UserId,
                Username = user?.Username ?? "Unknown",
                comment.Content,
                comment.CreatedAt
            });
        }

        // DELETE: api/comments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                return NotFound();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

}
