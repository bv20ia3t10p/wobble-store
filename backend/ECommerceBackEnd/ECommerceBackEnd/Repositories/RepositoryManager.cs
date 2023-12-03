using ECommerceBackEnd.Contracts;
using MongoDB.Driver;

namespace ECommerceBackEnd.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private const string databaseName = "wobble";
        private readonly Lazy<ICustomerRepository> _customerRepository;
        private readonly Lazy<IProductRepository> _productRepository;
        private readonly Lazy<ICategoryRepository> _categoryRepository;
        private readonly Lazy<IOrderRepository> _orderRepository;
        private readonly Lazy<IOrderDetailRepository> _orderDetailRepository;
        private readonly IMongoDatabase _database;
        public RepositoryManager(IMongoClient mongoClient)
        {
            _database = mongoClient.GetDatabase(databaseName);
            _productRepository = new Lazy<IProductRepository>(() => new ProductRepository(_database,"products"));
            _categoryRepository = new Lazy<ICategoryRepository>(() => new CategoryRepository(_database,"categories"));
            _customerRepository = new Lazy<ICustomerRepository>(() => new CustomerRepository(_database,"customers"));
            _orderRepository = new Lazy<IOrderRepository>(() => new OrderRepository(_database, "orders"));
            _orderDetailRepository = new Lazy<IOrderDetailRepository>(() => new OrderDetailRepository(_database, "order_details"));
        }
        public IOrderDetailRepository OrderDetail => _orderDetailRepository.Value;
        public ICustomerRepository Customer => _customerRepository.Value;
        public ICategoryRepository Category => _categoryRepository.Value;
        public IProductRepository Product => _productRepository.Value;
        public IOrderRepository Order => _orderRepository.Value;

    }
}
