using OrderService.Models;

namespace OrderService.Services
{
    public interface IOrderService
    {
        public Task<List<Order>> GetOrders(string UserId);
        public Task<Order> CreateOrderAsync(string UserId, List<OrderDto> orderDto);
    }
}
