using ECommerceBackEnd.Entities;

namespace ECommerceBackEnd.Contracts
{
    public interface IProductRepository
    {
        IEnumerable<Product> GetProducts();
        Product GetProduct(int PID);
        void CreateProduct(Product newProduct);
        public void UpdateProduct(Product product);
        public void DeleteProductById(int PID);
        public IEnumerable<Product> GetProductByCategory(int id);
        int GetLatestId();
    }
}
