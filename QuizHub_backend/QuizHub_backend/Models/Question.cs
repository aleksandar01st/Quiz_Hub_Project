using System.ComponentModel.DataAnnotations;

namespace QuizHub_backend.Models
{
    public class Question
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        public string QuestionType { get; set; } // možeš koristiti enum ako želiš

        [Required]
        public long QuizId { get; set; }
        public Quiz Quiz { get; set; }

        public ICollection<AnswerOption> AnswerOptions { get; set; }
        public ICollection<UserAnswer> UserAnswers { get; set; }
    }
}
