using Microsoft.AspNetCore.Identity;

namespace UserMicroservice.Models
{
    public class User : IdentityUser<Guid>
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
    }
}
