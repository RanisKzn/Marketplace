using CartService.Models;

namespace CartService.Services
{
    public interface ICartService
    {
        Task<List<CartItem>> GetCartAsync(string userId);
        Task UpdateCartAsync(CartDto cartDto);
        Task ClearCartAsync(string userId);
        Task RemoveCartItemAsync(string userId, string productId);
    }
}
