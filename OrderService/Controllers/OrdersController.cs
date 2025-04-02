using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OrderService.Models;
using OrderService.Services;

namespace OrderService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> CreateOrder(string userId)
        {
            try
            {
                var orders = await _orderService.GetOrders(userId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(string userId, [FromBody] List<OrderDto> orderDto)
        {
            try
            {
                var order = await _orderService.CreateOrderAsync(userId, orderDto);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
