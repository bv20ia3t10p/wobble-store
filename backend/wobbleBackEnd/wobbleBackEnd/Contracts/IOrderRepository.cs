using ECommerceBackEnd.Entities;

namespace ECommerceBackEnd.Contracts
{
    public interface IOrderRepository
    {
        IEnumerable<Order> GetOrders();
        Order GetOrderById(int id);
        IEnumerable<Order> GetOrdersByCustomer( int id);
        void UpdateOrder (Order order);
        void DeleteOrder(Order order);
        int GetLatestId();
        void CreateOrder(Order order);
    }
}
