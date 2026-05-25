using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace HeritageAPI.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AIAssistantController : ControllerBase
    {
        // lấy API Key Gemini free
        private readonly string _geminiApiKey = "AIzaSyCQcaH5IeKiaW5fliW1GL4a2FY88Vkft_8";

        [HttpPost("ask")]
        public async Task<IActionResult> AskQuestion([FromBody] AIRequest request)
        {
            if (string.IsNullOrEmpty(request.Question)) return BadRequest();

            using var httpClient = new HttpClient();
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_geminiApiKey}";


            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = "Bạn là hướng dẫn viên ảo du lịch Di Sản Việt Nam. Dựa vào kiến thức của bạn, hãy trả lời thật ngắn gọn, súc tích (dưới 5 dòng) và thân thiện cho câu hỏi sau: " + request.Question }
                        }
                    }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync(url, content);

         
            if (!response.IsSuccessStatusCode)
            {
                var errorDetail = await response.Content.ReadAsStringAsync();
                return StatusCode(500, new { answer = "LỖI GOOGLE TRẢ VỀ: " + errorDetail });
            }

            var result = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(result);
            var answer = doc.RootElement.GetProperty("candidates")[0]
                                        .GetProperty("content")
                                        .GetProperty("parts")[0]
                                        .GetProperty("text").GetString();

            return Ok(new { answer = answer });
        }
    }

        public class AIRequest
    {
        public string Question { get; set; }
    }
}
