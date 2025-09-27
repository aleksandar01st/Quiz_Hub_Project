using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizHub_backend.Data;
using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using QuizHub_backend.Service;

namespace QuizHub_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _service;

        public QuestionController(IQuestionService service)
        {
            _service = service;
        }

        // GET: api/Questions
        [HttpGet]
        public ActionResult<IEnumerable<QuestionDto>> GetQuestions() =>
            Ok(_service.GetAll());

        // GET: api/Questions/5
        [HttpGet("{id}")]
        public ActionResult<QuestionDto> GetQuestion(long id)
        {
            var question = _service.GetById(id);
            return question == null ? NotFound(new { message = "Pitanje nije pronađeno." }) : Ok(question);
        }

        // GET: api/Questions/by-quiz/5
        [HttpGet("by-quiz/{quizId}")]
        public ActionResult<IEnumerable<QuestionDto>> GetQuestionsByQuiz(long quizId) =>
            Ok(_service.GetByQuizId(quizId));


        // POST: api/Questions
        [HttpPost]
        public ActionResult<QuestionDto> CreateQuestion(CreateQuestionDto dto)
        {
            var created = _service.Create(dto);
            return CreatedAtAction(nameof(GetQuestion), new { id = created.Id }, created);
        }


        // PUT: api/Questions/5
        [HttpPut("{id}")]
        public ActionResult<QuestionDto> UpdateQuestion(long id, UpdateQuestionDto dto)
        {
            var updated = _service.Update(id, dto);
            return updated == null
                ? NotFound(new { message = "Pitanje nije pronađeno." })
                : Ok(updated);
        }


        // DELETE: api/Questions/5
        [HttpDelete("{id}")]
        public IActionResult DeleteQuestion(long id) =>
            _service.Delete(id) ? Ok(new { message = "Pitanje je uspešno obrisano." })
                                : NotFound(new { message = "Pitanje nije pronađeno." });
    }
}
