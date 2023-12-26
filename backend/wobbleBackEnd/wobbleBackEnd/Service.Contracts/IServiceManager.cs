using wobbleBackEnd.Service.Contracts;

namespace ECommerceBackEnd.Service.Contracts
{
    public interface IServiceManager
    {
        IDepartmentService Department {  get; }
        ICategoryService Category { get; }
        ICustomerService Customer { get; }
        IProductService Product { get; }
        IAuthService Auth { get; }
        IOrderService Order { get; }
        IOrderDetailService OrderDetail { get; }
        IStaffService Staff { get; }
    }
}
