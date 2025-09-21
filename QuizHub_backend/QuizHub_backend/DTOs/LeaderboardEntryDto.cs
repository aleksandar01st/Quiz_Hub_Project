namespace QuizHub_backend.DTOs
{
    public class LeaderboardEntryDto
    {
        public long UserId { get; set; }
        public string Username { get; set; }
        public int TotalScore { get; set; } // zbir svih rezultata korisnika
        public int QuizzesTaken { get; set; } // broj kvizova koje je korisnik odigrao
    }
}
