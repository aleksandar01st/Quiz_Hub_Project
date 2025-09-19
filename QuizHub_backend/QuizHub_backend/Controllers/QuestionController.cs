using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizHub_backend.Data;
using QuizHub_backend.DTOs;
using QuizHub_backend.Models;

namespace QuizHub_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly QuizHubContext _context;

        public QuestionController(QuizHubContext context)
        {
            _context = context;
        }

        // GET: api/Questions
        [HttpGet]
        public ActionResult<IEnumerable<QuestionDto>> GetQuestions()
        {
            var questions = _context.Questions
                .Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    QuestionType = q.QuestionType,
                    QuizId = q.QuizId
                })
                .ToList();

            return Ok(questions);
        }

        // GET: api/Questions/5
        [HttpGet("{id}")]
        public ActionResult<QuestionDto> GetQuestion(long id)
        {
            var question = _context.Questions.Find(id);
            if (question == null)
                return NotFound(new { message = "Pitanje nije pronađeno." });

            return Ok(new QuestionDto
            {
                Id = question.Id,
                Text = question.Text,
                QuestionType = question.QuestionType,
                QuizId = question.QuizId
            });
        }

        // GET: api/Questions/by-quiz/5
        [HttpGet("by-quiz/{quizId}")]
        public ActionResult<IEnumerable<QuestionDto>> GetQuestionsByQuiz(long quizId)
        {
            var questions = _context.Questions
                .Where(q => q.QuizId == quizId)
                .Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    QuestionType = q.QuestionType,
                    QuizId = q.QuizId,
                    AnswerOptions = q.AnswerOptions
                        .Select(a => new AnswerOptionDto
                        {
                            Id = a.Id,
                            Text = a.Text,
                            IsCorrect = a.IsCorrect
                        }).ToList()
                })
                .ToList();

            return Ok(questions);
        }


        // POST: api/Questions
        [HttpPost]
        public ActionResult<QuestionDto> CreateQuestion(CreateQuestionDto dto)
        {
            var question = new Question
            {
                Text = dto.Text,
                QuestionType = dto.QuestionType,
                QuizId = dto.QuizId,
                AnswerOptions = dto.AnswerOptions?.Select(a => new AnswerOption
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList() ?? new List<AnswerOption>()
            };

            _context.Questions.Add(question);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, new QuestionDto
            {
                Id = question.Id,
                Text = question.Text,
                QuestionType = question.QuestionType,
                QuizId = question.QuizId,
                AnswerOptions = question.AnswerOptions?.Select(a => new AnswerOptionDto
                {
                    Id = a.Id,
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList() ?? new List<AnswerOptionDto>()
            });
        }


        // PUT: api/Questions/5
        [HttpPut("{id}")]
        public ActionResult<QuestionDto> UpdateQuestion(long id, CreateQuestionDto dto)
        {
            var question = _context.Questions
                .Include(q => q.AnswerOptions)
                .FirstOrDefault(q => q.Id == id);

            if (question == null)
                return NotFound(new { message = "Pitanje nije pronađeno." });

            question.Text = dto.Text;
            question.QuestionType = dto.QuestionType;
            question.QuizId = dto.QuizId;

            // Update answer options
            question.AnswerOptions.Clear();
            question.AnswerOptions = dto.AnswerOptions?.Select(a => new AnswerOption
            {
                Text = a.Text,
                IsCorrect = a.IsCorrect,
                QuestionId = question.Id
            }).ToList();

            _context.SaveChanges();

            return Ok(new QuestionDto
            {
                Id = question.Id,
                Text = question.Text,
                QuestionType = question.QuestionType,
                QuizId = question.QuizId,
                AnswerOptions = question.AnswerOptions?.Select(a => new AnswerOptionDto
                {
                    Id = a.Id,
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList()
            });
        }


        // DELETE: api/Questions/5
        [HttpDelete("{id}")]
        public IActionResult DeleteQuestion(long id)
        {
            var question = _context.Questions.Find(id);
            if (question == null)
                return NotFound(new { message = "Pitanje nije pronađeno." });

            _context.Questions.Remove(question);
            _context.SaveChanges();

            return Ok(new { message = "Pitanje je uspešno obrisano." });
        }
    }
}
