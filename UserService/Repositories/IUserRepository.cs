using UserMicroservice.Models;

namespace UserMicroservice.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByIdAsync(int id);
        Task AddUserAsync(User user);
    }
}
