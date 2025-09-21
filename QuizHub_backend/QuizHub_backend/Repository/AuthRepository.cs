using QuizHub_backend.Data;
using QuizHub_backend.Models;

namespace QuizHub_backend.Repository
{
    public interface IAuthRepository
    {
        User? GetUserByUsernameOrEmail(string usernameOrEmail);
    }

    public class AuthRepository : IAuthRepository
    {
        private readonly QuizHubContext _context;

        public AuthRepository(QuizHubContext context)
        {
            _context = context;
        }

        public User? GetUserByUsernameOrEmail(string usernameOrEmail)
        {
            return _context.Users.FirstOrDefault(u =>
                u.Username == usernameOrEmail || u.Email == usernameOrEmail);
        }
    }
}
