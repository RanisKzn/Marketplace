using CartService.Models;
using Microsoft.EntityFrameworkCore;

namespace CartService.Data
{
    public class CartDbContext : DbContext
    {
        public CartDbContext(DbContextOptions<CartDbContext> options) : base(options) { }

        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Cart> Carts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cart>()
           .HasMany(c => c.Items)
           .WithOne()
           .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
