using Microsoft.AspNetCore.Mvc;
using QuizHub_backend.Data;
using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using QuizHub_backend.Service;
using System;

namespace QuizHub_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultsController : ControllerBase
    {
        private readonly IResultService _service;

        public ResultsController(IResultService service)
        {
            _service = service;
        }

        [HttpPost]
        public IActionResult SaveResult([FromBody] SaveResultDto dto)
        {
            if (dto == null) return BadRequest("Invalid data");

            var resultDto = _service.SaveResult(dto);
            if (resultDto == null) return BadRequest("User or Quiz not found");

            return Ok(resultDto);
        }

        [HttpGet("quiz/{quizId}")]
        public IActionResult GetResultsByQuiz(long quizId)
        {
            var results = _service.GetResultsByQuiz(quizId);
            return Ok(results);
        }
    }
}
