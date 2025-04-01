using CartService.Data;
using CartService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System.Linq;
using System.Text.Json;

namespace CartService.Services
{
    public class CartService : ICartService
    {
        private readonly CartDbContext _dbContext;
        private readonly ICacheService _cacheService;
        private readonly TimeSpan _cacheTimeout;
        private const string CartPrefix = "cart:";

        public CartService(CartDbContext dbContext, ICacheService cacheService)
        {
            _dbContext = dbContext;
            _cacheService = cacheService;
            _cacheTimeout = TimeSpan.FromMinutes(10);
        }

        public async Task<List<CartItem>> GetCartAsync(string userId)
        {
            string cacheKey = $"{CartPrefix}{userId}";
            var cachedCart = await _cacheService.GetAsync<Cart>(cacheKey);
            if (cachedCart != null)
            {
                return cachedCart.Items.ToList();
            }

            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart != null)
            {
                await _cacheService.SetAsync(cacheKey, cart, _cacheTimeout);
            }

            return cart.Items.ToList(); 
        }

        public async Task UpdateCartAsync(CartDto cartDto)
        {
            string cacheKey = $"{CartPrefix}{cartDto.UserId}";

            var cartDb = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == cartDto.UserId);

            if (cartDb == null)
            {
                Cart cart = new Cart
                {
                    UserId = cartDto.UserId,
                    Items = new List<CartItem>()
                };

                CartItem newCartItem = new CartItem
                {
                    ProductId = cartDto.ProductId,
                    Quantity = cartDto.Quantity
                };
                cart.Items.Add(newCartItem);
                _dbContext.Carts.Update(cart);
                await _dbContext.SaveChangesAsync();
                await _cacheService.SetAsync(cacheKey, cart, _cacheTimeout);
            }

            var cartItem = cartDb.Items.Find(c => c.ProductId == cartDto.ProductId);
            if(cartItem == null)
            {
                CartItem newCartItem = new CartItem
                {
                    ProductId = cartDto.ProductId,
                    Quantity = cartDto.Quantity
                };
                cartDb.Items.Add(newCartItem);
                _dbContext.Carts.Update(cartDb);
                await _dbContext.SaveChangesAsync();
                await _cacheService.SetAsync(cacheKey, cartDb, _cacheTimeout);
            }

            cartItem.Quantity += cartDto.Quantity;

            _dbContext.Carts.Update(cartDb);
            await _dbContext.SaveChangesAsync();

            await _cacheService.SetAsync(cacheKey, cartDb, _cacheTimeout);

            
        }

        public async Task ClearCartAsync(string userId)
        {
            string cacheKey = $"{CartPrefix}{userId}";

            var cart = await _dbContext.Carts.FirstOrDefaultAsync(c => c.UserId == userId);
            if (cart != null)
            {
                _dbContext.Carts.Remove(cart);
                await _dbContext.SaveChangesAsync();
            }

            await _cacheService.RemoveAsync(cacheKey);

        }

        public async Task RemoveCartItemAsync(string userId, string productId)
        {
            string cacheKey = $"{CartPrefix}{userId}";

            var cart = await _dbContext.Carts.FirstOrDefaultAsync(c => c.UserId == userId);
            var cartItem = cart.Items.Find(x => x.ProductId == productId);
            if (cartItem != null)
            {
                _dbContext.CartItems.Remove(cartItem);
                await _dbContext.SaveChangesAsync();
            }

            await _cacheService.SetAsync(cacheKey, cart, _cacheTimeout);
        }
    }
}
