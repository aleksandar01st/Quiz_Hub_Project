using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using QuizHub_backend.Repository;

namespace QuizHub_backend.Service
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _repo;

        public QuestionService(IQuestionRepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<QuestionDto> GetAll() =>
            _repo.GetAll().Select(q => ToDto(q));

        public QuestionDto? GetById(long id)
        {
            var q = _repo.GetById(id);
            return q == null ? null : ToDto(q);
        }

        public IEnumerable<QuestionDto> GetByQuizId(long quizId) =>
            _repo.GetByQuizId(quizId).Select(q => ToDto(q));

        public QuestionDto Create(CreateQuestionDto dto)
        {
            var question = new Question
            {
                Text = dto.Text,
                QuestionType = dto.QuestionType,
                QuizId = dto.QuizId,
                Weight = dto.Weight,
                AnswerOptions = dto.AnswerOptions?.Select(a => new AnswerOption
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList() ?? new List<AnswerOption>()
            };
            _repo.Add(question);
            _repo.Save();
            return ToDto(question);
        }

        public bool Delete(long id)
        {
            var q = _repo.GetById(id);
            if (q == null) return false;
            _repo.Delete(q);
            _repo.Save();
            return true;
        }

        public QuestionDto? Update(long id, UpdateQuestionDto dto)
        {
            var q = _repo.GetById(id);
            if (q == null) return null;

            q.Text = dto.Text;
            q.Weight = dto.Weight;
            q.QuestionType = dto.QuestionType;

            // Update odgovora
            q.AnswerOptions.Clear(); // brišemo stare
            if (dto.AnswerOptions != null)
            {
                q.AnswerOptions = dto.AnswerOptions.Select(a => new AnswerOption
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList();
            }

            _repo.Update(q);
            _repo.Save();

            return ToDto(q);
        }



        private static QuestionDto ToDto(Question q) =>
            new QuestionDto
            {
                Id = q.Id,
                Text = q.Text,
                QuestionType = q.QuestionType,
                QuizId = q.QuizId,
                Weight = q.Weight,
                AnswerOptions = q.AnswerOptions?
                    .Select(a => new AnswerOptionDto
                    {
                        Id = a.Id,
                        Text = a.Text,
                        IsCorrect = a.IsCorrect
                    }).ToList() ?? new List<AnswerOptionDto>()
            };
    }
}
