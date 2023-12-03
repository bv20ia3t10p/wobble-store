using AutoMapper;
using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Service.Contracts;

namespace ECommerceBackEnd.Service
{
    public class ProductService : IProductService
    {
        private readonly IMapper _mapper;
        private readonly IRepositoryManager _repository;
        public ProductService(IMapper mapper, IRepositoryManager repository)
        {
            _mapper = mapper;
            _repository = repository;
        }
        public IEnumerable<ProductDto> GetProducts() => _mapper.Map<IEnumerable<ProductDto>>(_repository.Product.GetProducts());
        public ProductDto GetProductById(int id) => _mapper.Map<ProductDto>(_repository.Product.GetProduct(id));
        public IEnumerable<ProductDto> GetProductByCategory(int cid) => _mapper.Map<IEnumerable<ProductDto>>(_repository.Product.GetProductByCategory(cid));
        public ProductDto CreateProduct(CreateProductDto newProduct)

        {
            var productEntity = _mapper.Map<Product>(newProduct);
            var categoryInDb = _repository.Category.GetCategoryById(newProduct.CategoryId) ?? throw new Exception("Category not found");
            _mapper.Map(categoryInDb, productEntity);
            int insertId = _repository.Product.GetLatestId();
            productEntity.ProductCardId = insertId;
            _repository.Product.CreateProduct(productEntity);

            return _mapper.Map<ProductDto>(productEntity);
        }
        public void DeleteProduct(int id) => _repository.Product.DeleteProductById(id);

        public ProductDto UpdateProduct(UpdateProductDto newProduct)
        {
            var productInDb = _repository.Product.GetProduct(newProduct.CategoryId);
            if ( productInDb.CategoryId != newProduct.CategoryId)
            {
                var categoryInDb = _repository.Category.GetCategoryById(newProduct.CategoryId);
                _mapper.Map(categoryInDb, productInDb);
            }
            _mapper.Map(newProduct,productInDb);
            _repository.Product.UpdateProduct(productInDb);
            return _mapper.Map<ProductDto>(productInDb);
        }
        public int GetProductSoldQuantity(int id) => _repository.OrderDetail.GetOrderDetailsForProduct(id).Sum(c => c.OrderItemQuantity);
        public IEnumerable<ProductDto> GetMultipleProductsByIds(IEnumerable<int> ids)
        {
            var products = new List<ProductDto>();
            foreach (int i in ids)
            {
                products.Add(_mapper.Map<ProductDto>(_repository.Product.GetProduct(i)));
            }
            return products;
        }
    }
}
