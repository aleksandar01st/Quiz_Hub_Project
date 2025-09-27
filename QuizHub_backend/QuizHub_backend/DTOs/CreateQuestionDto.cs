namespace QuizHub_backend.DTOs
{
    public class CreateQuestionDto
    {
        public string Text { get; set; }
        public string QuestionType { get; set; }
        public long QuizId { get; set; }
        public int Weight { get; set; } = 1;
        public List<CreateAnswerOptionDto> AnswerOptions { get; set; }
    }
}
