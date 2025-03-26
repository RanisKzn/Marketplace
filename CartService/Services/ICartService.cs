using CartService.Models;

namespace CartService.Services
{
    public interface ICartService
    {
        Task <IEnumerable<CartItem>> GetCartItemAsync(string userId);
        Task AddToCartAsync(string userId, CartItem item);
        Task RemoveFromCartAsync(string userId, string productId);
        Task ClearCartAsync(string userId);
    }
}
