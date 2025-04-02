namespace CartService.Models
{
    public class CartProductDto
    {
        public string Id { get; set; } = null!;
        public int Quantity { get; set; }
        public string Description { get; set; } = null!;
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public string Image { get; set; } = null!;
    }
}
