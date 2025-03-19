using AuthService.Controllers;
using AuthService.DTOs;
using AuthService.Models;

namespace AuthService.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterModel model);
        Task<string> LoginAsync(LoginModel model);
        Task<string> GenerateRefreshToken(User user);
        Task<User> ValidateRefreshToken(string token);
        Task<string> GenerateJWTAsync(User user);
        Task DeleteTokensForUser(string userId);
    }
}
