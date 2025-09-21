namespace QuizHub_backend.DTOs
{
    public class SaveResultDto
    {
        public long QuizId { get; set; }
        public long UserId { get; set; }
        public int Score { get; set; }
        public int TimeTaken { get; set; } // u sekundama

        public List<UserAnswerDto>? UserAnswers { get; set; }
    }


    public class UserAnswerDto
    {
        public long QuestionId { get; set; }
        public string SelectedAnswer { get; set; } = string.Empty;
    }

    public class UserAnswersDto
    {
        public string QuestionText { get; set; } = "";
        public string SelectedAnswer { get; set; } = "";
        public string CorrectAnswer { get; set; } = "";
    }

}
