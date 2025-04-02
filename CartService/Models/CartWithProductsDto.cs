namespace CartService.Models
{
    public class CartWithProductsDto
    {
        public List<CartProductDto> Products { get; set; } = new();
    }
}
