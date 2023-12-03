using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Entities;
using MongoDB.Driver;

namespace ECommerceBackEnd.Repositories
{
    public class OrderRepository : RepositoryBase<Order>, IOrderRepository
    {
        public OrderRepository(IMongoDatabase database, string collectionName) : base(database, collectionName)
        {
        }
        public IEnumerable<Order> GetOrders() => GetAll().ToList();
        public Order GetOrderById(int id) => GetByCondition(c => c.OrderId == id);
        public IEnumerable<Order> GetOrdersByCustomer(int id) => GetManyByCondition(c=>c.CustomerId == id);
        public void UpdateOrder(Order order) =>Update(c=>c.OrderId == order.OrderId,order);
        public void DeleteOrder(Order order) => Delete(c=>c.OrderId == order.OrderId);
        public int GetLatestId() => GetAll().ToList().OrderByDescending(c => c.OrderId).FirstOrDefault().OrderId + 1;
        public void CreateOrder(Order order) => Create(order);
    }
}
