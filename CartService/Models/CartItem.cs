﻿namespace CartService.Models
{
    public class CartItem
    {
        public Guid CartItemId { get; set; } = Guid.NewGuid();
        public string ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
