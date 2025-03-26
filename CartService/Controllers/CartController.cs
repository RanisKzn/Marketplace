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
            var cart = await _cartService.GetCartItemAsync(userId);
            if (cart is null)
            {
                return NotFound();
            }
            return Ok(cart);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> AddItemToCart(string userId, [FromBody] CartItem item)
        {
            await _cartService.AddToCartAsync(userId, item);
            return Ok();
        }

        [HttpDelete("{userId}/{productId}")]
        public async Task<IActionResult> RemoveItemFromCart(string userId, string productId)
        {
            await _cartService.RemoveFromCartAsync(userId, productId);
            return Ok();
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> ClearCart(string userId)
        {
            await _cartService.ClearCartAsync(userId);
            return Ok();
        }
    }
}
