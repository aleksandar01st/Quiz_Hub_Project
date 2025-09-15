using System.ComponentModel.DataAnnotations;

namespace QuizHub_backend.Models
{
    public class UserAnswer
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long ResultId { get; set; }
        public UserQuizResult Result { get; set; }

        [Required]
        public long QuestionId { get; set; }
        public Question Question { get; set; }

        [Required]
        public string SelectedAnswer { get; set; } // može JSON ako ima više
    }
}
