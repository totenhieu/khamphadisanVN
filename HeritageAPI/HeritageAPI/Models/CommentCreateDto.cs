namespace HeritageAPI.Models
{
    public class CommentCreateDto
    {
        public int HeritageId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
    }
}
