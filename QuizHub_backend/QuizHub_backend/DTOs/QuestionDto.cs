namespace QuizHub_backend.DTOs
{
    public class QuestionDto
    {
        public long Id { get; set; }
        public string Text { get; set; }
        public string QuestionType { get; set; }
        public long QuizId { get; set; }
        public int Weight { get; set; }
        public List<AnswerOptionDto> AnswerOptions { get; set; }
    }
}
