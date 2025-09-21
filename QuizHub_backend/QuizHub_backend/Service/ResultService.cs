using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using QuizHub_backend.Repository;

namespace QuizHub_backend.Service
{
    public class ResultService : IResultService
    {
        private readonly IResultRepository _repo;

        public ResultService(IResultRepository repo)
        {
            _repo = repo;
        }

        public QuizResultDto? SaveResult(SaveResultDto dto)
        {
            var user = _repo.GetUser(dto.UserId);
            var quiz = _repo.GetQuiz(dto.QuizId);
            if (user == null || quiz == null) return null;

            var userAnswers = new List<UserAnswer>();

            if (dto.UserAnswers != null)
            {
                foreach (var a in dto.UserAnswers)
                {
                    var question = _repo.GetQuestion(a.QuestionId);
                    if (question != null)
                    {
                        userAnswers.Add(new UserAnswer
                        {
                            Question = question,
                            SelectedAnswer = a.SelectedAnswer
                        });
                    }
                }
            }

            var result = new UserQuizResult
            {
                User = user,
                Quiz = quiz,
                Score = dto.Score,
                TimeTaken = dto.TimeTaken,
                DatePlayed = DateTime.UtcNow,
                UserAnswers = userAnswers
            };

            _repo.AddResult(result);
            _repo.SaveChanges();

            return new QuizResultDto
            {
                Id = result.Id,
                Score = result.Score,
                TimeTaken = result.TimeTaken,
                DatePlayed = result.DatePlayed,
                Username = user.Username
            };
        }

        public IEnumerable<QuizResultDto> GetResultsByQuiz(long quizId)
        {
            return _repo.GetResultsByQuiz(quizId)
                .Select(r => new QuizResultDto
                {
                    Id = r.Id,
                    Score = r.Score,
                    TimeTaken = r.TimeTaken,
                    DatePlayed = r.DatePlayed,
                    Username = r.User.Username
                })
                .OrderByDescending(r => r.Score)
                .ToList();
        }
    }
}
