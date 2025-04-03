using Microsoft.EntityFrameworkCore;
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

            var orderList =  await _dbContext.Orders
                .Include(c => c.Items)
                .Where(c => c.UserId == UserId)
                .ToListAsync();

            if (orderList == null)
            {
                return new List<Order>();
            }

            return orderList;
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
                    Price = item.Price 
                }).ToList(),
                TotalPrice = orderDto.Sum(item => item.Price * item.Quantity)
            };

            // Сохраняем заказ в базу данных
            _dbContext.Orders.AddAsync(order);
            await _dbContext.SaveChangesAsync();

            // Возвращаем заказ
            return order;
        }
    }
}
