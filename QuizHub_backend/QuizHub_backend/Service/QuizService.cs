using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using QuizHub_backend.Repository;

namespace QuizHub_backend.Service
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository _repo;

        public QuizService(IQuizRepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<QuizDto> GetAll() =>
            _repo.GetAll().Select(q => ToDto(q));

        public QuizDto? GetById(long id)
        {
            var quiz = _repo.GetById(id);
            return quiz == null ? null : ToDto(quiz);
        }

        public QuizDto Create(CreateQuizDto dto)
        {
            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Difficulty = dto.Difficulty,
                TimeLimit = dto.TimeLimit
            };
            _repo.Add(quiz);
            _repo.SaveChanges();
            return ToDto(quiz);
        }

        public QuizDto? Update(int id, CreateQuizDto dto)
        {
            var quiz = _repo.GetById(id);
            if (quiz == null) return null;

            quiz.Title = dto.Title;
            quiz.Description = dto.Description;
            quiz.Category = dto.Category;
            quiz.Difficulty = dto.Difficulty;
            quiz.TimeLimit = dto.TimeLimit;

            _repo.Update(quiz);
            _repo.SaveChanges();
            return ToDto(quiz);
        }

        public bool Delete(long id)
        {
            var quiz = _repo.GetById(id);
            if (quiz == null) return false;

            _repo.Delete(quiz);
            _repo.SaveChanges();
            return true;
        }

        public IEnumerable<string> GetCategories() => _repo.GetCategories();

        private static QuizDto ToDto(Quiz quiz) => new QuizDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            Category = quiz.Category,
            Difficulty = quiz.Difficulty,
            TimeLimit = quiz.TimeLimit
        };
    }
}
