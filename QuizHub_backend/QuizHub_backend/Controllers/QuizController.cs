using Microsoft.AspNetCore.Mvc;
using QuizHub_backend.Data;
using QuizHub_backend.DTOs;
using QuizHub_backend.Models;

namespace QuizHub_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly QuizHubContext _context;

        public QuizController(QuizHubContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<QuizDto>> GetQuizzes()
        {
            var quizzes = _context.Quizzes.Select(q => new QuizDto
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                Category = q.Category,
                Difficulty = q.Difficulty,
                TimeLimit = q.TimeLimit
            }).ToList();

            return Ok(quizzes);
        }

        [HttpGet("{id}")]
        public ActionResult<QuizDto> GetQuiz(long id)
        {
            var quiz = _context.Quizzes.Find(id);
            if (quiz == null) return NotFound();

            return Ok(new QuizDto
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                Category = quiz.Category,
                Difficulty = quiz.Difficulty,
                TimeLimit = quiz.TimeLimit
            });
        }

        [HttpPost]
        public ActionResult<QuizDto> CreateQuiz(CreateQuizDto dto)
        {
            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Difficulty = dto.Difficulty,
                TimeLimit = dto.TimeLimit
            };

            _context.Quizzes.Add(quiz);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, new QuizDto
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                Category = quiz.Category,
                Difficulty = quiz.Difficulty,
                TimeLimit = quiz.TimeLimit
            });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteQuiz(long id)
        {
            var quiz = _context.Quizzes.Find(id);
            if (quiz == null)
                return NotFound(new { message = "Kviz nije pronađen." });

            _context.Quizzes.Remove(quiz);
            _context.SaveChanges();

            return Ok(new { message = "Kviz je uspešno obrisan." });
        }

    }
}
