namespace OrderService.Models
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItem> Items { get; set; }
        public string Status { get; set; } = "Pending"; 
        public decimal TotalPrice { get; set; }
    }
}
