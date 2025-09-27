using Microsoft.EntityFrameworkCore;
using QuizHub_backend.DTOs;
using QuizHub_backend.Models;
using QuizHub_backend.Repository;
using System.Text.RegularExpressions;

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
            // ✅ Validacija lozinke (min 6 karaktera)
            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                throw new ArgumentException("Lozinka mora imati najmanje 6 karaktera.");

            // ✅ Validacija email-a
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                !Regex.IsMatch(dto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                throw new ArgumentException("Email nije u validnom formatu.");

            // ✅ Provera da li username već postoji
            if (_repo.GetAll().Any(u => u.Username.ToLower() == dto.Username.ToLower()))
                throw new ArgumentException("Korisničko ime je već zauzeto.");

            // ✅ Provera da li email već postoji
            if (_repo.GetAll().Any(u => u.Email.ToLower() == dto.Email.ToLower()))
                throw new ArgumentException("Email je već zauzet.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password), // hash lozinke
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
