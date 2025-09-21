using Microsoft.AspNetCore.Mvc;
using QuizHub_backend.Data;
using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using System;

namespace QuizHub_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultsController : ControllerBase
    {
        private readonly QuizHubContext _context;

        public ResultsController(QuizHubContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult SaveResult([FromBody] SaveResultDto dto)
        {
            if (dto == null) return BadRequest("Invalid data");

            var user = _context.Users.Find(dto.UserId);
            var quiz = _context.Quizzes.Find(dto.QuizId);

            if (user == null || quiz == null)
                return BadRequest("User or Quiz not found");

            var userAnswers = new List<UserAnswer>();

            if (dto.UserAnswers != null)
            {
                foreach (var a in dto.UserAnswers)
                {
                    var question = _context.Questions.Find(a.QuestionId);
                    if (question != null)
                    {
                        userAnswers.Add(new UserAnswer
                        {
                            Question = question,
                            SelectedAnswer = a.SelectedAnswer
                        });
                    }
                    // opcionalno: else loguj ili baci exception ako pitanje ne postoji
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

            _context.UserQuizResults.Add(result);
            _context.SaveChanges();

            var resultDto = new QuizResultDto
            {
                Id = result.Id,
                Score = result.Score,
                TimeTaken = result.TimeTaken,
                DatePlayed = result.DatePlayed,
                Username = user.Username
            };

            return Ok(resultDto);
        }


        [HttpGet("quiz/{quizId}")]
        public IActionResult GetResultsByQuiz(long quizId)
        {
            var results = _context.UserQuizResults
                .Where(r => r.QuizId == quizId)
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

            return Ok(results);
        }
    }
}
