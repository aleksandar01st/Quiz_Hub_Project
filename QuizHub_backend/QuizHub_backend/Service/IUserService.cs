using QuizHub_backend.DTOs;

namespace QuizHub_backend.Service
{
    public interface IUserService
    {
        IEnumerable<UserDto> GetUsers();
        UserDto? GetUser(long id);
        UserDto CreateUser(CreateUserDto dto);
    }
}
