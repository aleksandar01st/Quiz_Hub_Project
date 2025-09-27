using QuizHub_backend.DTOs;

namespace QuizHub_backend.Service
{
    public interface IQuestionService
    {
        IEnumerable<QuestionDto> GetAll();
        QuestionDto? GetById(long id);
        IEnumerable<QuestionDto> GetByQuizId(long quizId);
        QuestionDto Create(CreateQuestionDto dto);
        QuestionDto? Update(long id, UpdateQuestionDto dto);
        bool Delete(long id);
    }
}
