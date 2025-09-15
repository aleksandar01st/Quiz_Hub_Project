using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuizHub_backend.Models
{
    public class Quiz
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string Difficulty { get; set; }

        [Required]
        public int TimeLimit { get; set; }

        // Relacije
        public ICollection<Question> Questions { get; set; }
        public ICollection<UserQuizResult> Results { get; set; }
    }
}
