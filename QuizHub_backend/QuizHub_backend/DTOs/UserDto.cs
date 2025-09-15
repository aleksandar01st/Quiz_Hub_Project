namespace QuizHub_backend.DTOs
{
    public class UserDto
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string ProfileImage { get; set; }
    }
}
