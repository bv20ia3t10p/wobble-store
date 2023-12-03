using ECommerceBackEnd.Dtos;

namespace ECommerceBackEnd.Service.Contracts
{
    public interface IProductService
    {
        IEnumerable<ProductDto> GetProducts();
        ProductDto GetProductById(int id);
        IEnumerable<ProductDto> GetProductByCategory(int categoryId);
        ProductDto CreateProduct(CreateProductDto newProduct);
        ProductDto UpdateProduct(UpdateProductDto updateProduct);
        void DeleteProduct(int id);
        int GetProductSoldQuantity(int id);
        IEnumerable<ProductDto> GetMultipleProductsByIds(IEnumerable<int> ids);
    }
}
