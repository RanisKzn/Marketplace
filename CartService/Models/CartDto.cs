﻿namespace CartService.Models
{
    public class CartDto
    {
        public string UserId { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
