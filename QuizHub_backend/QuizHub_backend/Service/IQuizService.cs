using QuizHub_backend.DTOs;

namespace QuizHub_backend.Service
{
    public interface IQuizService
    {
        IEnumerable<QuizDto> GetAll();
        QuizDto? GetById(long id);
        QuizDto Create(CreateQuizDto dto);
        QuizDto? Update(int id, CreateQuizDto dto);
        bool Delete(long id);
        IEnumerable<string> GetCategories();
    }
}
