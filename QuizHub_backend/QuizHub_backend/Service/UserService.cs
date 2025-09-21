using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using QuizHub_backend.Repository;

namespace QuizHub_backend.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<UserDto> GetUsers()
        {
            return _repo.GetAll()
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role.ToString(),
                    ProfileImage = u.ProfileImage
                })
                .ToList();
        }

        public UserDto? GetUser(long id)
        {
            var user = _repo.GetById(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                ProfileImage = user.ProfileImage
            };
        }

        public UserDto CreateUser(CreateUserDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = Enum.TryParse<UserRole>(dto.Role, out var role) ? role : UserRole.User,
                ProfileImage = dto.ProfileImage
            };

            _repo.Add(user);
            _repo.SaveChanges();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                ProfileImage = user.ProfileImage
            };
        }
    }
}
