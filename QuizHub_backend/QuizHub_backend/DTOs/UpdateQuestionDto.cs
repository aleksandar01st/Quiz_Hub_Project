namespace QuizHub_backend.DTOs
{
    public class UpdateQuestionDto
    {
        public string Text { get; set; } = "";
        public string QuestionType { get; set; } = "";
        public int Weight { get; set; } = 1;
        public List<AnswerOptionDto>? AnswerOptions { get; set; }
    }
}
