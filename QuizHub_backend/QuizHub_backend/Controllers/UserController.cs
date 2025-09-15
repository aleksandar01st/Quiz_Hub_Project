using Microsoft.AspNetCore.Mvc;
using QuizHub_backend.Data;
using QuizHub_backend.DTOs;
using QuizHub_backend.Models;

namespace QuizHub_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly QuizHubContext _context;

        public UserController(QuizHubContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserDto>> GetUsers()
        {
            var users = _context.Users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role.ToString(),
                ProfileImage = u.ProfileImage
            }).ToList();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<UserDto> GetUser(long id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return Ok(new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                ProfileImage = user.ProfileImage
            });
        }

        [HttpPost]
        public ActionResult<UserDto> CreateUser(CreateUserDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = Enum.TryParse<UserRole>(dto.Role, out var role) ? role : UserRole.User,
                ProfileImage = dto.ProfileImage
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                ProfileImage = user.ProfileImage
            });
        }
    }
}
