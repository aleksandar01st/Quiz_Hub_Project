using QuizHub_backend.Models;

namespace QuizHub_backend.Repository
{
    public interface IResultRepository
    {
        User? GetUser(long userId);
        Quiz? GetQuiz(long quizId);
        Question? GetQuestion(long questionId);
        void AddResult(UserQuizResult result);
        IEnumerable<UserQuizResult> GetResultsByQuiz(long quizId);
        void SaveChanges();
    }
}
