using QuizHub_backend.DTOs;

namespace QuizHub_backend.Service
{
    public interface IResultService
    {
        QuizResultDto? SaveResult(SaveResultDto dto);
        IEnumerable<QuizResultDto> GetResultsByQuiz(long quizId);
    }
}
