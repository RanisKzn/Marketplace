using MongoDB.Driver;
using ProductService.Models;

namespace ProductService.Services
{
    public interface IProductService
    {
        Task<List<Product>> GetAsync();
        Task<Product?> GetAsync(string id);
        Task CreateAsync(Product newProduct);
        Task UpdateAsync(string id, Product updatedProduct);
        Task RemoveAsync(string id);
        IMongoCollection<Product> GetProductCollection();
        Task<List<Product>> GetPaginatedAsync(int skip, int limit);
        Task<long> GetTotalCountAsync();
    }
}
