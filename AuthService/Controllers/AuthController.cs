using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Services;
using AuthService.DTOs;
using Microsoft.AspNetCore.Authorization;
using AuthService.Models;

namespace AuthService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, UserManager<User> userManager, ILogger<AuthController> logger)
        {
            _authService = authService;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("me")]
        [Authorize] 
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new { user.Email, Roles = roles });
        }

        
        [HttpGet("admin-only")]
        [Authorize(Roles = "Admin")] 
        public IActionResult AdminOnly()
        {
            return Ok("Привет, админ! Этот эндпоинт доступен только для роли Admin.");
        }

        
        [HttpGet("user-only")]
        [Authorize(Roles = "User")] 
        public IActionResult UserOnly()
        {
            return Ok("Привет, пользователь! Этот эндпоинт доступен только для роли User.");
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            var user = await _authService.ValidateRefreshToken(refreshToken);
            if (user == null)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var newJwtToken = _authService.GenerateJWTAsync(user);
            var newRefreshToken = await _authService.GenerateRefreshToken(user);

            return Ok(new { token = newJwtToken, refreshToken = newRefreshToken });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                var result = await _authService.RegisterAsync(model);
                return Ok(new { message = result });
            }
            catch (Exception ex)
            { 
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst("sub")?.Value;
            if (userId == null) return Unauthorized();

            await _authService.DeleteTokensForUser(userId); 
            return Ok(new { message = "Выход выполнен успешно." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                var token = await _authService.LoginAsync(model);
                _logger.LogInformation($"Пользователь {model.Username} успешно вошел в систему.");
                return Ok(new { token });
            }
            catch (UnauthorizedAccessException)
            {
                _logger.LogWarning($"Неудачный вход: {model.Username}");
                return Unauthorized();
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Неудачный вход: {model.Username}");
                return BadRequest(ex.Message);
            }
        }
    }
}
