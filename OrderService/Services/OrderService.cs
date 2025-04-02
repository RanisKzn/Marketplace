using OrderService.Data;
using OrderService.Models;

namespace OrderService.Services
{
    public class OrderService : IOrderService
    {
        private readonly OrderDbContext _dbContext;

        public OrderService(OrderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Order>> GetOrders(string UserId)
        {
            if (String.IsNullOrEmpty(UserId))
            {
                throw new Exception("Orders is empty");
            }


            return new List<Order>();
        }

        public async Task<Order> CreateOrderAsync(string UserId, List<OrderDto> orderDto)
        {
            if (String.IsNullOrEmpty(UserId)|| !orderDto.Any())
            {
                throw new Exception("Cart is empty, cannot create order.");
            }

            // Создаем заказ
            var order = new Order
            {
                UserId = UserId,
                OrderDate = DateTime.UtcNow,
                Status = "Created",
                Items = orderDto.Select(item => new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Price // Можно добавить логику расчета стоимости
                }).ToList(),
                TotalPrice = orderDto.Sum(item => item.Price)
            };

            // Сохраняем заказ в базу данных
            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();

            // Возвращаем заказ
            return order;
        }
    }
}
