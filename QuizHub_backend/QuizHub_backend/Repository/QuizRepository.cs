using QuizHub_backend.Data;
using QuizHub_backend.Models;

namespace QuizHub_backend.Repository
{
    public class QuizRepository : IQuizRepository
    {
        private readonly QuizHubContext _context;

        public QuizRepository(QuizHubContext context)
        {
            _context = context;
        }

        public IEnumerable<Quiz> GetAll() => _context.Quizzes.ToList();

        public Quiz? GetById(long id) => _context.Quizzes.Find(id);

        public void Add(Quiz quiz) => _context.Quizzes.Add(quiz);

        public void Update(Quiz quiz) => _context.Quizzes.Update(quiz);

        public void Delete(Quiz quiz) => _context.Quizzes.Remove(quiz);

        public IEnumerable<string> GetCategories() =>
            _context.Quizzes.Select(q => q.Category).Distinct().ToList();

        public void SaveChanges() => _context.SaveChanges();
    }
}
