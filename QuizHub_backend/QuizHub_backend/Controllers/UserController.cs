using Microsoft.AspNetCore.Mvc;
using QuizHub_backend.Data;
using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using QuizHub_backend.Service;

namespace QuizHub_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserDto>> GetUsers()
        {
            var users = _service.GetUsers();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<UserDto> GetUser(long id)
        {
            var user = _service.GetUser(id);
            if (user == null) return NotFound(new { message = "Korisnik nije pronađen." });
            return Ok(user);
        }

        [HttpPost]
        public ActionResult<UserDto> CreateUser(CreateUserDto dto)
        {
            try
            {
                var createdUser = _service.CreateUser(dto);
                return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
            }
            catch (ArgumentException ex)
            {
                // ❌ Validacija nije prošla → vrati 400 i poruku
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                // ⚠️ Ostale greške (npr. DB greška) → vrati 500
                return StatusCode(500, new { message = "Došlo je do greške prilikom kreiranja korisnika." });
            }
        }

    }
}
