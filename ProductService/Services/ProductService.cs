using MongoDB.Bson;
using MongoDB.Driver;
using ProductService.Models;

namespace ProductService.Services
{
    public class ProductService : IProductService
    {
        private readonly IMongoCollection<Product> _products;

        public ProductService(IConfiguration config)
        {
            var client = new MongoClient(config.GetConnectionString("MongoDB"));
            var database = client.GetDatabase("ProductDb");
            _products = database.GetCollection<Product>("Products");
        }

        public IMongoCollection<Product> GetProductCollection()
        {
            return _products;
        }

        public async Task<List<Product>> GetAsync() =>
            await _products.Find(_ => true).ToListAsync();

        public async Task<Product?> GetAsync(string id) =>
            await _products.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Product newProduct) =>
            await _products.InsertOneAsync(newProduct);

        public async Task UpdateAsync(string id, Product updatedProduct) =>
            await _products.ReplaceOneAsync(x => x.Id == id, updatedProduct);

        public async Task RemoveAsync(string id) =>
            await _products.DeleteOneAsync(x => x.Id == id);

        public async Task<(List<Product> Items, int TotalPages)> GetProductsAsync(
            string? search, decimal? minPrice, decimal? maxPrice,
            string? sortBy, string? order, int page, int limit)
        {
            var filter = Builders<Product>.Filter.Empty;

            if (!string.IsNullOrEmpty(search))
                filter &= Builders<Product>.Filter.Regex(p => p.Name, new BsonRegularExpression(search, "i"));

            if (minPrice.HasValue)
                filter &= Builders<Product>.Filter.Gte(p => p.Price, minPrice.Value);

            if (maxPrice.HasValue)
                filter &= Builders<Product>.Filter.Lte(p => p.Price, maxPrice.Value);

            
            var totalCount = await _products.CountDocumentsAsync(filter);
            var totalPages = (int)Math.Ceiling((double)totalCount / limit);

            var query = _products.Find(filter);

            if (!string.IsNullOrEmpty(sortBy))
            {
                var sortDefinition = order?.ToLower() == "desc"
                    ? Builders<Product>.Sort.Descending(sortBy)
                    : Builders<Product>.Sort.Ascending(sortBy);
                query = query.Sort(sortDefinition);
            }

            var items = await query
                .Skip((page - 1) * limit)
                .Limit(limit)
                .ToListAsync();

            return (items, totalPages);
        }

        public async Task<long> GetTotalCountAsync() =>
            await _products.CountDocumentsAsync(_ => true);
    }
}
