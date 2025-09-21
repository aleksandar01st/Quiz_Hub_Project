namespace QuizHub_backend.DTOs
{
    public class QuizResultDto
    {
        public long Id { get; set; }
        public int Score { get; set; }
        public int TimeTaken { get; set; }
        public DateTime DatePlayed { get; set; }
        public string Username { get; set; } = string.Empty;
    }
}
