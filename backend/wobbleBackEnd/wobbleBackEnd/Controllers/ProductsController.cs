using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace ECommerceBackEnd.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IServiceManager _services;
        public ProductsController(IServiceManager service)
        {
            _services = service;
        }
        [HttpGet]
        [EnableQuery]
        // GET /products
        public ActionResult<IEnumerable<ProductDto>> GetProducts()
        {
            var products = _services.Product.GetProducts();
            return Ok(products);
        }
        //GET /products/id
        [HttpGet("{id}")]
        public ActionResult<ProductDto> GetProduct(int id)
        {
            var product = _services.Product.GetProductById(id);
            return Ok(product);
        }
        //POST /items
        [HttpPost]
        [Authorize]
        public ActionResult<ProductDto> CreateProduct(CreateProductDto productDto)
        {
            var product = _services.Product.CreateProduct(productDto);
            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductCardId }, product);
        }

        [HttpGet]
        [EnableQuery]
        [Route(nameof(GetProductByCategory))]
        public ActionResult<IEnumerable<ProductDto>> GetProductByCategory(int id) => Ok(_services.Product.GetProductByCategory(id));
        [HttpPut]
        public ActionResult<ProductDto> UpdateProduct(UpdateProductDto updateProduct) => Ok(_services.Product.UpdateProduct(updateProduct));
        [HttpDelete]
        public ActionResult DeleteProduct(int id)
        {
            _services.Product.DeleteProduct(id);
            return NoContent();
        }
        [HttpPost("Multiple")]
        public ActionResult<IEnumerable<ProductDto>> GetMultipleProductsByIds([FromBody] IEnumerable<int> ids)
        {
            return Ok(_services.Product.GetMultipleProductsByIds(ids));
        }
    }
}
