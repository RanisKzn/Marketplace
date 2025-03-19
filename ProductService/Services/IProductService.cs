using MongoDB.Driver;
using ProductService.Models;

namespace ProductService.Services
{
    public interface IProductService
    {
        Task<(List<Product> Items, int TotalPages)> GetProductsAsync(string? search, decimal? minPrice, decimal? maxPrice, string? sortBy, string? order, int page, int limit);
        Task<Product?> GetAsync(string id);
        Task CreateAsync(Product newProduct);
        Task UpdateAsync(string id, Product updatedProduct);
        Task RemoveAsync(string id);
        IMongoCollection<Product> GetProductCollection();
        Task<long> GetTotalCountAsync();
    }
}
