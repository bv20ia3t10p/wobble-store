using wobbleBackEnd.Contracts;

namespace ECommerceBackEnd.Contracts
{
    public interface IRepositoryManager
    {
        IDepartmentRepository Department { get; }
        IProductRepository Product { get; }
        ICustomerRepository Customer { get; }
        ICategoryRepository Category { get; }
        IOrderRepository Order { get; }
        IOrderDetailRepository OrderDetail { get; }
        IStaffRepository Staff { get; }
        IStatRepository Stat { get; }
    }
}
