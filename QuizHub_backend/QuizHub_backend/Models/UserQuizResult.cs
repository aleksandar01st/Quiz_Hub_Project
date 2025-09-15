using System.ComponentModel.DataAnnotations;

namespace QuizHub_backend.Models
{
    public class UserQuizResult
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public int Score { get; set; }

        [Required]
        public int TimeTaken { get; set; } // u sekundama

        [Required]
        public DateTime DatePlayed { get; set; }

        [Required]
        public long UserId { get; set; }
        public User User { get; set; }

        [Required]
        public long QuizId { get; set; }
        public Quiz Quiz { get; set; }

        public ICollection<UserAnswer> UserAnswers { get; set; }
    }
}
