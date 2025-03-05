using UserMicroservice.DTOs;

namespace UserMicroservice.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(UserDto userDto);
    }
}
