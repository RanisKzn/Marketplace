using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductService.Models;
using ProductService.Services;

namespace ProductService.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IYandexStorageService _yandexStorageService;

        public ProductsController(IProductService productService, IYandexStorageService yandexStorageService)
        {
            _productService = productService;
            _yandexStorageService = yandexStorageService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? search,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? sortBy,
            [FromQuery] string? order = "asc",
            [FromQuery] string? ids = null,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10
            )
        {
            if(ids != null)
            {
                var idList = ids.Split(',').ToList(); 
                var products = await _productService.GetProductsByIds(idList);
                if (products is null)
                {
                    return NotFound();
                }
                return Ok(new { Products = products });
            }
            var (items, totalPages) = await _productService.GetProductsAsync(search, minPrice, maxPrice, sortBy, order, page, limit);

            var response = new
            {
                Items = items,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        [HttpPost("upload")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Файл не выбран");

            var imageUrl = await _yandexStorageService.UploadFileAsync(
                file.OpenReadStream(),
                Guid.NewGuid().ToString() + Path.GetExtension(file.FileName),
                file.ContentType
            );

            return Ok(new { imageUrl });
        }

        [HttpGet("{id:length(24)}")]
        [AllowAnonymous]
        public async Task<ActionResult<Product>> Get(string id)
        {
            var product = await _productService.GetAsync(id);

            if (product is null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Post([FromBody]Product newProduct)
        {
            await _productService.CreateAsync(newProduct);
            return CreatedAtAction(nameof(Get), new { id = newProduct.Id }, newProduct);
        }

        [HttpPut("{id:length(24)}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(string id, [FromBody]Product updatedProduct)
        {
            var product = await _productService.GetAsync(id);

            if (product is null)
            {
                return NotFound();
            }

            await _productService.UpdateAsync(id, updatedProduct);

            return Ok(updatedProduct);
        }

        [HttpDelete("{id:length(24)}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var product = await _productService.GetAsync(id);

            if (product is null)
            {
                return NotFound();
            }

            await _productService.RemoveAsync(id);

            return NoContent();
        }
    }
}
