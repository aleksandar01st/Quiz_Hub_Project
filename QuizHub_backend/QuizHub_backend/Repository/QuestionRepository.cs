using Microsoft.EntityFrameworkCore;
using QuizHub_backend.Data;
using QuizHub_backend.Models;

namespace QuizHub_backend.Repository
{
    public class QuestionRepository : IQuestionRepository
    {
        private readonly QuizHubContext _context;

        public QuestionRepository(QuizHubContext context)
        {
            _context = context;
        }

        public IEnumerable<Question> GetAll() =>
            _context.Questions.Include(q => q.AnswerOptions).ToList();

        public Question? GetById(long id) =>
            _context.Questions.Include(q => q.AnswerOptions).FirstOrDefault(q => q.Id == id);

        public IEnumerable<Question> GetByQuizId(long quizId) =>
            _context.Questions
                .Include(q => q.AnswerOptions)
                .Where(q => q.QuizId == quizId)
                .ToList();

        public Question Add(Question question)
        {
            _context.Questions.Add(question);
            return question;
        }

        public void Update(Question question) => _context.Questions.Update(question);

        public void Delete(Question question) => _context.Questions.Remove(question);

        public void Save() => _context.SaveChanges();
    }
}
