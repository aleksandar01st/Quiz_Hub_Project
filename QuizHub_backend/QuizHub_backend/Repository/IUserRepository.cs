using QuizHub_backend.Models;

namespace QuizHub_backend.Repository
{
    public interface IUserRepository
    {
        IEnumerable<User> GetAll();
        User? GetById(long id);
        void Add(User user);
        void SaveChanges();
    }
}
