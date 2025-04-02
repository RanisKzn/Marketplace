namespace OrderService.Models
{
    public class OrderDto
    {
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
