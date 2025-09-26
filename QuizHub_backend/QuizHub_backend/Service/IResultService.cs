using QuizHub_backend.DTOs;

namespace QuizHub_backend.Service
{
    public interface IResultService
    {
        QuizResultDto? SaveResult(SaveResultDto dto);
        IEnumerable<QuizResultDto> GetResultsByQuiz(long quizId);
        IEnumerable<LeaderboardEntryDto> GetGlobalLeaderboard();
        IEnumerable<AllQuizResultDto> GetResultsByUser(long userId);
        IEnumerable<UserAnswersDto> GetUserAnswers(long resultId);
        IEnumerable<TopResultDto> GetTopResults(
            long? quizId = null, DateTime? from = null, DateTime? to = null);
    }
}
