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

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PaginatedResponse<Product>>> Get([FromQuery] int page = 1, [FromQuery] int limit = 9)
        {
            int skip = (page - 1) * limit;

            var products = await _productService.GetPaginatedAsync(skip, limit);
            var totalProducts = (int)( await _productService.GetTotalCountAsync());

            var response = new PaginatedResponse<Product>
            {
                Items = products,
                TotalCount = totalProducts,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling(totalProducts / (double)limit)
            };

            return Ok(response);
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
        [Authorize]
        public async Task<IActionResult> Post([FromBody]Product newProduct)
        {
            await _productService.CreateAsync(newProduct);
            return CreatedAtAction(nameof(Get), new { id = newProduct.Id }, newProduct);
        }

        [HttpPut("{id:length(24)}")]
        [Authorize]
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
        [Authorize]
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
