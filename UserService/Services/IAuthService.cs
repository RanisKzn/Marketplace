using AuthService.Controllers;
using AuthService.DTOs;

namespace AuthService.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterModel model);
        Task<string> LoginAsync(LoginModel model);
    }
}
