namespace ECommerceBackEnd.Contracts
{
    public interface IRepositoryManager
    {
        IProductRepository Product { get; }
        ICustomerRepository Customer { get; }
        ICategoryRepository Category { get; }
        IOrderRepository Order { get; }
        IOrderDetailRepository OrderDetail { get; }
    }
}
