using CartService.Data;
using CartService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace CartService.Services
{
    public class CartService : ICartService
    {
        private readonly CartDbContext _dbContext;
        private readonly ICacheService _cacheService;
        private readonly TimeSpan _cacheTimeout;
        private const string CartPrefix = "cart:";
        private readonly HttpClient _httpClient;
        private readonly string _productservice;

        public CartService(CartDbContext dbContext, ICacheService cacheService, HttpClient httpClient, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _cacheService = cacheService;
            _httpClient = httpClient;
            _cacheTimeout = TimeSpan.FromMinutes(10);
            _productservice = configuration.GetValue<string>("productservice");
        }

        public async Task<CartWithProductsDto> GetCartAsync(string userId)
        {
            string cacheKey = $"{CartPrefix}{userId}";
            var cachedCart = await _cacheService.GetAsync<Cart>(cacheKey);

            if (cachedCart == null)
            {
                cachedCart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);
                if (cachedCart == null)
                {
                     return new CartWithProductsDto();
                }
               
                await _cacheService.SetAsync(cacheKey, cachedCart, _cacheTimeout);
            }

            var productIds = cachedCart.Items.Select(i => i.ProductId).Distinct().ToList();
            var productDetails = new List<CartProductDto>();

            foreach (var productId in productIds)
            {
                string productCacheKey = $"cart_products:{productId}";
                var cachedProduct = await _cacheService.GetAsync<CartProductDto>(productCacheKey);

                if (cachedProduct != null)
                {
                    productDetails.Add(cachedProduct);
                }
            }

            var missingProductIds = productIds
                .Where(id => productDetails.All(p => p.Id != id))
                .ToList();

            if (missingProductIds.Any())
            {
                var qwe = $"http://{_productservice}/api/products?ids={string.Join(",", missingProductIds)}";
                var response = await _httpClient.GetAsync(qwe);
                var products = await response.Content.ReadFromJsonAsync<CartWithProductsDto>();

                if (products != null)
                {
                    foreach (var product in products.Products)
                    {
                        string productCacheKey = $"cart_products:{product.Id}";
                        await _cacheService.SetAsync(productCacheKey, product, _cacheTimeout);
                        productDetails.Add(product);
                    }
                }
            }

            var cartWithProducts = new CartWithProductsDto
            {
                Products = cachedCart.Items.Select(item => new CartProductDto
                {
                    Id = item.ProductId,
                    Quantity = item.Quantity,
                    Name = productDetails.FirstOrDefault(p => p.Id == item.ProductId)?.Name ?? "Неизвестный товар",
                    Description = productDetails.FirstOrDefault(p => p.Id == item.ProductId)?.Description ?? "Описание",
                    Price = productDetails.FirstOrDefault(p => p.Id == item.ProductId)?.Price ?? 0,
                    Image = productDetails.FirstOrDefault(p => p.Id == item.ProductId)?.Id
                }).ToList()
            };

            return cartWithProducts;
        }

        public async Task UpdateCartAsync(CartDto cartDto)
        {
            string cacheKey = $"{CartPrefix}{cartDto.UserId}";

            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            var cart = await _dbContext.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == cartDto.UserId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = cartDto.UserId,
                    Items = new List<CartItem>
                    {
                        new()
                        {
                            ProductId = cartDto.ProductId,
                            Quantity = cartDto.Quantity
                        }
                    }
                };

                await _dbContext.Carts.AddAsync(cart);
            }
            else
            {
                var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == cartDto.ProductId);

                if (existingItem != null)
                {
                    existingItem.Quantity += cartDto.Quantity;
                }
                else
                {
                    var newCartItem = new CartItem
                    {
                        ProductId = cartDto.ProductId,
                        Quantity = cartDto.Quantity
                    };

                    cart.Items.Add(newCartItem);
                    await _dbContext.CartItems.AddAsync(newCartItem);
                }
            }

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            await _cacheService.SetAsync(cacheKey, cart, _cacheTimeout);
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

            var cart = await _dbContext.Carts.
                Include(c => c.Items).
                FirstOrDefaultAsync(c => c.UserId == userId);

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
