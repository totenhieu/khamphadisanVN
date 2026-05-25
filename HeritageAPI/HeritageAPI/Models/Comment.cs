namespace HeritageAPI.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int HeritageId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        
        public virtual User User { get; set; }
    }
}
