using Microsoft.EntityFrameworkCore;
using QuizHub_backend.Data;
using QuizHub_backend.Models;

namespace QuizHub_backend.Repository
{
    public class ResultRepository : IResultRepository
    {
        private readonly QuizHubContext _context;

        public ResultRepository(QuizHubContext context)
        {
            _context = context;
        }

        public User? GetUser(long userId) => _context.Users.Find(userId);

        public Quiz? GetQuiz(long quizId) => _context.Quizzes.Find(quizId);

        public Question? GetQuestion(long questionId) => _context.Questions.Find(questionId);

        public void AddResult(UserQuizResult result) => _context.UserQuizResults.Add(result);

        public IEnumerable<UserQuizResult> GetResultsByQuiz(long quizId)
        {
            return _context.UserQuizResults
                .Include(r => r.User)   // ✅ učitaj povezane korisnike
                .Include(r => r.Quiz)   // (opciono) učitaj kviz ako treba
                .Where(r => r.QuizId == quizId)
                .ToList();
        }

        public void SaveChanges() => _context.SaveChanges();
    }
}
