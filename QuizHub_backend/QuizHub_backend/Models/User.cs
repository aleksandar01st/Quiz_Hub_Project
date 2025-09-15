﻿using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace QuizHub_backend.Models
{
    public class User
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public UserRole Role { get; set; }

        [Required]
        public string ProfileImage { get; set; }

        public ICollection<UserQuizResult> Results { get; set; }
    }
}
