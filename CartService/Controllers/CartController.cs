using CartService.Models;
using CartService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace CartService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService, IDatabase redisDb)
        {
            _cartService = cartService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(string userId)
        {
            var cart = await _cartService.GetCartAsync(userId);
            if (cart is null)
            {
                return NotFound();
            }
            return Ok(cart);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCart([FromBody] CartDto cart)
        {
            await _cartService.UpdateCartAsync(cart);
            return Ok(new { message = "Корзина обновлена." });
        }

        [HttpDelete("{userId}/{productId}")]
        public async Task<IActionResult> RemoveItemFromCart(string userId, string productId)
        {
            await _cartService.RemoveCartItemAsync(userId, productId);
            return Ok(new { message = "Товар удален." });
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> ClearCart(string userId)
        {
            await _cartService.ClearCartAsync(userId);
            return Ok(new { message = "Корзина очищена." });
        }
    }
}
