using Microsoft.EntityFrameworkCore;
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

        public IEnumerable<LeaderboardEntryDto> GetGlobalLeaderboard()
        {
            var results = _repo.GetAllResults(); // IEnumerable<UserQuizResult>
            var users = _repo.GetAllUsers();     // IEnumerable<User>

            var leaderboard = results
                .GroupBy(r => r.User.Id)
                .Select(g =>
                {
                    var user = users.FirstOrDefault(u => u.Id == g.Key);

                    // Grupisanje po kvizu, uzimamo poslednji rezultat po datumu
                    var latestResultsPerQuiz = g
                        .GroupBy(r => r.Quiz.Id)
                        .Select(quizGroup => quizGroup
                            .OrderByDescending(r => r.DatePlayed)
                            .First()
                        )
                        .ToList();

                    var totalScore = latestResultsPerQuiz.Sum(r => r.Score);
                    var quizzesTaken = latestResultsPerQuiz.Count;

                    return new LeaderboardEntryDto
                    {
                        UserId = g.Key,
                        Username = user != null ? user.Username : "Nepoznat",
                        TotalScore = totalScore,
                        QuizzesTaken = quizzesTaken
                    };
                })
                .OrderByDescending(x => x.TotalScore)
                .ToList();

            return leaderboard;
        }


        public IEnumerable<AllQuizResultDto> GetResultsByUser(long userId)
        {
            return _repo.GetAllResults()
                .Where(r => r.User.Id == userId)
                .Select(r => new AllQuizResultDto
                {
                    Id = r.Id,
                    Score = r.Score,
                    TimeTaken = r.TimeTaken,
                    DatePlayed = r.DatePlayed,
                    Username = r.User.Username,
                    QuizTitle = r.Quiz.Title
                })
                .OrderByDescending(r => r.DatePlayed)
                .ToList();
        }

        public IEnumerable<UserAnswersDto> GetUserAnswers(long resultId)
        {
            var result = _repo.GetAllResultsWithDetails().FirstOrDefault(r => r.Id == resultId);
            if (result == null) return Enumerable.Empty<UserAnswersDto>();

            return result.UserAnswers.Select(a => new UserAnswersDto
            {
                QuestionText = a.Question.Text,
                SelectedAnswer = a.SelectedAnswer,
                CorrectAnswer = string.Join(", ",
                    a.Question.AnswerOptions
                        .Where(o => o.IsCorrect)
                        .Select(o => o.Text))
            }).ToList();
        }

        public IEnumerable<TopResultDto> GetTopResults(
            long? quizId = null, DateTime? from = null, DateTime? to = null)
        {
            var results = _repo.GetAllResults(); // IEnumerable<UserQuizResult>

            // Filter po kvizu
            if (quizId.HasValue)
                results = results.Where(r => r.Quiz.Id == quizId.Value);

            // Filter po vremenskom periodu
            if (from.HasValue)
                results = results.Where(r => r.DatePlayed >= from.Value);
            if (to.HasValue)
                results = results.Where(r => r.DatePlayed <= to.Value);

            // Grupisanje po kvizu + uzimanje najboljih rezultata
            var topResults = results
                .GroupBy(r => r.Quiz.Id)
                .SelectMany(g => g
                    .OrderByDescending(r => r.Score)
                    .ThenBy(r => r.DatePlayed) // ako je score isti, raniji rezultat je bolji
                    .Select((r, index) => new TopResultDto
                    {
                        QuizId = r.Quiz.Id,
                        QuizTitle = r.Quiz.Title,
                        Username = r.User.Username,
                        Score = r.Score,
                        TimeTaken = r.TimeTaken,
                        DatePlayed = r.DatePlayed,
                        Position = index + 1
                    })
                )
                .ToList();

            return topResults;
        }

    }
}
