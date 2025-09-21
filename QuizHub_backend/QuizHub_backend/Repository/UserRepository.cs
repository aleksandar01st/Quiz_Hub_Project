using QuizHub_backend.Data;
using QuizHub_backend.Models;

namespace QuizHub_backend.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly QuizHubContext _context;

        public UserRepository(QuizHubContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAll() => _context.Users.ToList();

        public User? GetById(long id) => _context.Users.Find(id);

        public void Add(User user) => _context.Users.Add(user);

        public void SaveChanges() => _context.SaveChanges();
    }
}
