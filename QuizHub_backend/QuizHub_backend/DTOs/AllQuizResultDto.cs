namespace QuizHub_backend.DTOs
{
    public class AllQuizResultDto
    {
        public long Id { get; set; }
        public int Score { get; set; }
        public int TimeTaken { get; set; }
        public DateTime DatePlayed { get; set; }
        public string Username { get; set; } = string.Empty;
        public string QuizTitle {  get; set; } = string.Empty;
    }
}
