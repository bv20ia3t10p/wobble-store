using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Entities;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ECommerceBackEnd.Repositories
{
    public class ProductRepository : RepositoryBase<Product>, IProductRepository
    {
        public ProductRepository(IMongoDatabase database, string collectionName)
        : base(database, collectionName)
        {
        }

        public int GetLatestId() => GetAll().ToList().OrderByDescending(c => c.ProductCardId).FirstOrDefault().ProductCardId + 1;


        void IProductRepository.CreateProduct(Product newProduct) => Create(newProduct);
        void IProductRepository.DeleteProductById(int PID) => Delete(c => c.ProductCardId == PID);

        Product IProductRepository.GetProduct(int PID) => GetByCondition(c => c.ProductCardId == PID);

        IEnumerable<Product> IProductRepository.GetProducts() => GetAll().ToList();

        void IProductRepository.UpdateProduct(Product product) => Update(c => c.ProductCardId == product.ProductCardId, product);
        public IEnumerable<Product> GetProductByCategory(int id) => GetManyByCondition(c => c.CategoryId == id);
    }
}
