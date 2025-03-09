using MongoDB.Driver;
using ProductService.Models;

namespace ProductService.DataSeeders
{
    public static class DataSeeder
    {
        public static async Task SeedDataAsync(IMongoCollection<Product> productCollection)
        {
            bool existProducts = await productCollection.Find(_ => true).AnyAsync();

            if (!existProducts)
            {
                await productCollection.InsertManyAsync(GetPredefinedProducts());
            }
        }

        private static IEnumerable<Product> GetPredefinedProducts()
        {
            return new List<Product>
        {
            new Product { Name = "Product 1", Description = "Description of Product 1", Price = 10.00m, Image = "https://via.placeholder.com/150" },
            new Product { Name = "Product 2", Description = "Description of Product 2", Price = 20.00m, Image = "https://via.placeholder.com/150" },
            new Product { Name = "Product 3", Description = "Description of Product 3", Price = 30.00m, Image = "https://via.placeholder.com/150" },
        };
        }
    }
}
