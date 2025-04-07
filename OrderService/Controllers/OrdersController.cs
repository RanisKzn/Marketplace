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
        private readonly RabbitMqProducer _rabbitMqProducer;

        public OrdersController(IOrderService orderService, RabbitMqProducer rabbitMqProducer)
        {
            _rabbitMqProducer = rabbitMqProducer;
            _orderService = orderService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> CreateOrder(string userId)
        {
            try
            {
                var order = await _orderService.GetOrders(userId);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> CreateOrder( string userId, [FromBody] List<OrderDto> orderDto)
        {
            try
            {
                var order = await _orderService.CreateOrderAsync(userId, orderDto);
                _rabbitMqProducer.SendMessage(order);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
