namespace QuizHub_backend.DTOs
{
    public class TopResultDto
    {
        public long QuizId { get; set; }
        public string QuizTitle { get; set; } = "";
        public string Username { get; set; } = "";
        public int Score { get; set; }
        public int TimeTaken { get; set; }
        public DateTime DatePlayed { get; set; }
        public int Position { get; set; }
    }
}
