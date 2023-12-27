using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.WebUtilities;
using wobbleBackEnd.Service.Contracts;

namespace ECommerceBackEnd.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IServiceManager _services;
        private readonly IUriService _uriService;
        public ProductsController(IServiceManager service, IUriService uriService)
        {
            _services = service;
            _uriService = uriService;
        }
        [HttpGet("Alt/Product")]
        private Uri AppendParamsAsQueryString(Uri modifiedPage,
            int? categoryId,
            int? DepartmentId,
            string? productName,
            double? productPriceGt,
            double? productPriceLs,
            double? productSoldQuantityGt,
            double? productSoldQuantityLs,
            bool? productStatus,
            bool? orderByIdAsc,
            bool? orderByPriceAsc,
            bool? orderBySoldAsc,
            bool? orderByNameAsc)
        {
            if (categoryId is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(categoryId), categoryId.ToString()));
            }
            if (DepartmentId is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(DepartmentId), DepartmentId.ToString()));
            }
            if (productName is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(productName), productName.ToString()));

            }
            if (productPriceGt is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(productPriceGt), productPriceGt.ToString()));
            }
            if (productPriceLs is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(productPriceLs), productPriceLs.ToString()));
            }
            if (productSoldQuantityGt is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(productSoldQuantityGt), productSoldQuantityGt.ToString()));
            }
            if (productSoldQuantityLs is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(productSoldQuantityLs), productSoldQuantityLs.ToString()));
            }
            if (productStatus is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(productStatus), productStatus.ToString()));
            }
            if (orderByIdAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByIdAsc), orderByIdAsc.ToString()));
            }
            if (orderByPriceAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByPriceAsc), orderByPriceAsc.ToString()));
            }
            if (orderBySoldAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderBySoldAsc), orderBySoldAsc.ToString()));
            }
            if (orderByNameAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByNameAsc), orderByNameAsc.ToString()));
            }
            return modifiedPage;
        }

        [HttpGet]
        [EnableQuery]
        // GET /products
        public ActionResult<IEnumerable<ProductDto>> GetProducts(int? PageSize, int? PageNumber,
            int? categoryId,
            int? DepartmentId,
            string? productName,
            double? productPriceGt,
            double? productPriceLs,
            double? productSoldQuantityGt,
            double? productSoldQuantityLs,
            bool? productStatus,
            bool? orderByIdAsc,
            bool? orderByPriceAsc,
            bool? orderBySoldAsc,
            bool? orderByNameAsc
            )
        {
            var products = _services.Product.GetProducts();
            Console.WriteLine(categoryId.ToString(),
                              DepartmentId,
                              productName,
                              productPriceGt,
                              productPriceLs,
                              productSoldQuantityGt,
                              productSoldQuantityLs,
                              productStatus,
                              orderByIdAsc,
                              orderByPriceAsc,
                              orderBySoldAsc,
                              orderByNameAsc);
            if (categoryId != null) products = products.Where(c => c.CategoryId.Equals(categoryId)).ToList();
            if (DepartmentId != null) products = products.Where(c => c.DepartmentId.Equals(DepartmentId)).ToList();
            if (productName != null) products = products.Where(c => c.ProductName.ToLower().Contains(productName.ToLower())).ToList();
            if (productPriceGt != null) products = products.Where(c => c.ProductPrice >= productPriceGt).ToList();
            if (productPriceLs != null) products = products.Where(c => c.ProductPrice <= productPriceLs).ToList();
            if (productSoldQuantityGt != null) products = products.Where(c => c.ProductSoldQuantity >= productSoldQuantityGt).ToList();
            if (productSoldQuantityLs != null) products = products.Where(c => c.ProductSoldQuantity <= productSoldQuantityLs).ToList();
            if (productStatus != null) products = products.Where(c => c.Equals(productStatus)).ToList();
            if (orderByIdAsc != null) products = (bool)orderByIdAsc ? products.OrderBy(c => c.ProductCardId) : products.OrderByDescending(c => c.ProductCardId);
            if (orderByPriceAsc != null) products = (bool)orderByPriceAsc ? products.OrderBy(c => c.ProductPrice) : products.OrderByDescending(c => c.ProductPrice);
            if (orderBySoldAsc != null) products = (bool)orderBySoldAsc ? products.OrderBy(c => c.ProductSoldQuantity) : products.OrderByDescending(c => c.ProductSoldQuantity);
            if (orderByNameAsc != null) products = (bool)orderByNameAsc ? products.OrderBy(c => c.ProductName) : products.OrderByDescending(c => c.ProductName);
            if (PageSize != null && PageNumber != null)
            {
                var route = Request.Path.Value;
                var validFilter = new PaginationFilter((int)PageNumber, (int)PageSize);
                var pagedData = products.Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                    .Take(validFilter.PageSize)
                    .ToList();
                var totalRecords = products.Count();
                var pagedResponse = Extension.CreatePagedReponse<ProductDto>(pagedData, validFilter, totalRecords, _uriService, route);
                if (pagedResponse.FirstPage != null) pagedResponse.FirstPage = AppendParamsAsQueryString(pagedResponse.FirstPage, categoryId,
                DepartmentId,
                productName,
                productPriceGt,
                productPriceLs,
                productSoldQuantityGt,
                productSoldQuantityLs,
                productStatus,
                orderByIdAsc,
                orderByPriceAsc,
                orderBySoldAsc,
                orderByNameAsc);
                if (pagedResponse.LastPage != null) pagedResponse.LastPage = AppendParamsAsQueryString(pagedResponse.LastPage, categoryId,
                    DepartmentId,
                    productName,
                    productPriceGt,
                    productPriceLs,
                    productSoldQuantityGt,
                    productSoldQuantityLs,
                    productStatus,
                    orderByIdAsc,
                    orderByPriceAsc,
                    orderBySoldAsc,
                    orderByNameAsc);
                if (pagedResponse.NextPage != null) pagedResponse.NextPage = AppendParamsAsQueryString(pagedResponse.NextPage, categoryId,
                    DepartmentId,
                    productName,
                    productPriceGt,
                    productPriceLs,
                    productSoldQuantityGt,
                    productSoldQuantityLs,
                    productStatus,
                    orderByIdAsc,
                    orderByPriceAsc,
                    orderBySoldAsc,
                    orderByNameAsc);
                if (pagedResponse.PreviousPage != null) pagedResponse.PreviousPage = AppendParamsAsQueryString(pagedResponse.PreviousPage, categoryId,
                    DepartmentId,
                    productName,
                    productPriceGt,
                    productPriceLs,
                    productSoldQuantityGt,
                    productSoldQuantityLs,
                    productStatus,
                    orderByIdAsc,
                    orderByPriceAsc,
                    orderBySoldAsc,
                    orderByNameAsc);
                return Ok(pagedResponse);
            }
            else return Ok(products);
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
        [Authorize(Roles = "ADMINISTRATOR")]
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
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult<ProductDto> UpdateProduct(UpdateProductDto updateProduct) => Ok(_services.Product.UpdateProduct(updateProduct));
        [HttpDelete]
        [Authorize(Roles ="ADMINISTRATOR")]
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
