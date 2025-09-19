namespace QuizHub_backend.DTOs
{
    public class AnswerOptionDto
    {
        public long Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}
