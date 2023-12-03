using AutoMapper;
using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Repositories;
using ECommerceBackEnd.Service.Contracts;

namespace ECommerceBackEnd.Service
{
    public class ServiceManager : IServiceManager
    {
        private readonly Lazy<ICategoryService> _categoryService;
        private readonly Lazy<ICustomerService> _customerService;
        private readonly Lazy<IProductService> _productService;
        private readonly Lazy<IAuthService> _authService;
        private readonly Lazy<IOrderService> _orderService;
        private readonly Lazy<IOrderDetailService> _orderDetailService;
        public ServiceManager(IMapper mapper, IRepositoryManager repositoryManager,IConfiguration configuration)
        {
            _categoryService = new Lazy<ICategoryService>(() => new CategoryService(mapper, repositoryManager));
            _productService = new Lazy<IProductService>(() => new ProductService(mapper, repositoryManager));
            _customerService = new Lazy<ICustomerService>(() => new CustomerService(mapper, repositoryManager));
            _authService = new Lazy<IAuthService>(() => new AuthService(repositoryManager,configuration));
            _orderService = new Lazy<IOrderService>(() => new OrderService(mapper, repositoryManager));
            _orderDetailService = new Lazy<IOrderDetailService>(()=>new OrderDetailService(mapper,repositoryManager));

        }
        public IAuthService Auth => _authService.Value;
        public ICategoryService Category => _categoryService.Value;
        public IProductService Product => _productService.Value;
        public ICustomerService Customer => _customerService.Value;
        public IOrderService Order => _orderService.Value;
        public IOrderDetailService OrderDetail => _orderDetailService.Value;
    }
}
