using UserMicroservice.DTOs;
using UserMicroservice.Models;
using UserMicroservice.Repositories;

namespace UserMicroservice.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            };
        }

        public async Task<UserDto> CreateUserAsync(UserDto userDto)
        {
            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = "hashed_password" // В реальном приложении используйте хеширование пароля
            };

            await _userRepository.AddUserAsync(user);

            userDto.Id = user.Id;
            return userDto;
        }
    }
}
