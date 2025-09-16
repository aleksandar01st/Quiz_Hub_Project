using Microsoft.EntityFrameworkCore;
using QuizHub_backend.Models;

namespace QuizHub_backend.Data
{
    public class QuizHubContext : DbContext
    {
        public QuizHubContext(DbContextOptions<QuizHubContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<AnswerOption> AnswerOptions { get; set; }
        public DbSet<UserQuizResult> UserQuizResults { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User -> Results
            modelBuilder.Entity<User>()
                .HasMany(u => u.Results)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Quiz -> Questions
            modelBuilder.Entity<Quiz>()
                .HasMany(q => q.Questions)
                .WithOne(ques => ques.Quiz)
                .HasForeignKey(ques => ques.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            // Quiz -> Results
            modelBuilder.Entity<Quiz>()
                .HasMany(q => q.Results)
                .WithOne(r => r.Quiz)
                .HasForeignKey(r => r.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            // Question -> AnswerOptions
            modelBuilder.Entity<Question>()
                .HasMany(q => q.AnswerOptions)
                .WithOne(a => a.Question)
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Question -> UserAnswers
            modelBuilder.Entity<Question>()
                .HasMany(q => q.UserAnswers)
                .WithOne(ua => ua.Question)
                .HasForeignKey(ua => ua.QuestionId)
                .OnDelete(DeleteBehavior.Cascade); // OK, SQL Server vidi samo ovu kaskadu

            // UserQuizResult -> UserAnswers
            modelBuilder.Entity<UserQuizResult>()
                .HasMany(r => r.UserAnswers)
                .WithOne(ua => ua.Result)
                .HasForeignKey(ua => ua.ResultId)
                .OnDelete(DeleteBehavior.Restrict); // OBAVEZNO Restrict da ne pravi multiple cascade paths
        }

    }
}
