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

        public IEnumerable<UserQuizResult> GetAllResults()
        {
            return _context.UserQuizResults
                .Include(r => r.User)   // da bismo imali Username
                .Include(r => r.Quiz)   // opciono, ako treba
                .ToList();
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public IEnumerable<UserQuizResult> GetAllResultsWithDetails()
        {
            return _context.UserQuizResults
                .Include(r => r.User)
                .Include(r => r.Quiz)
                    .ThenInclude(q => q.Questions) // ovo je ključno da totalQuestions nije null
                .Include(r => r.UserAnswers)
                    .ThenInclude(a => a.Question)
                        .ThenInclude(q => q.AnswerOptions)
                .ToList();
        }

        public int GetQuestionsCountForQuiz(long quizId)
        {
            return _context.Questions.Count(q => q.QuizId == quizId);
        }

        public Dictionary<long, int> GetQuestionsCountForQuizzes(IEnumerable<long> quizIds)
        {
            return _context.Questions
                .Where(q => quizIds.Contains(q.QuizId))
                .GroupBy(q => q.QuizId)
                .ToDictionary(g => g.Key, g => g.Count());
        }

    }
}
