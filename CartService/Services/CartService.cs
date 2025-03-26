using CartService.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace CartService.Services
{
    public class CartService : ICartService
    {
        private readonly IDatabase _redisDb;
        private const string CartPrefix = "cart:";

        public CartService(IConnectionMultiplexer redisDb)
        {
            _redisDb = redisDb.GetDatabase();
        }

        public async Task<IEnumerable<CartItem>> GetCartItemAsync(string userId)
        {
            string cartKey = $"{CartPrefix}{userId}";
            string cartJson = await _redisDb.StringGetAsync(cartKey);

            return string.IsNullOrEmpty(cartJson)
            ? new List<CartItem>()
            : JsonSerializer.Deserialize<List<CartItem>>(cartJson);
        }

        public async Task AddToCartAsync(string userId, CartItem item)
        {
            string cartKey = $"{CartPrefix}{userId}";
            string cartJson = await _redisDb.StringGetAsync(cartKey);
            
            List<CartItem> cartItems = string.IsNullOrEmpty(cartJson)
                ? new List<CartItem>()
                : JsonSerializer.Deserialize<List<CartItem>>(cartJson);

            var existingItem = cartItems.FirstOrDefault(x => x.ProductId == item.ProductId);
            if (existingItem is null)
            {
                cartItems.Add(item);
            }
            else
            {
                existingItem.Quantity += item.Quantity;
            }
            await _redisDb.StringSetAsync(cartKey, JsonSerializer.Serialize(cartItems));
        }

        public async Task RemoveFromCartAsync(string userId, string productId)
        {
            string cartKey = $"{CartPrefix}{userId}";
            string cartJson = await _redisDb.StringGetAsync(cartKey);
            if (!string.IsNullOrEmpty(cartJson))
            {
                List<CartItem> cartItems = JsonSerializer.Deserialize<List<CartItem>>(cartJson);
                cartItems.RemoveAll(i => i.ProductId == productId);
                await _redisDb.StringSetAsync(cartKey, JsonSerializer.Serialize(cartItems));

            }
        }

        public async Task ClearCartAsync(string userId)
        {
            string cartKey = $"{CartPrefix}{userId}";
            await _redisDb.KeyDeleteAsync(userId);
        }
    }
}
