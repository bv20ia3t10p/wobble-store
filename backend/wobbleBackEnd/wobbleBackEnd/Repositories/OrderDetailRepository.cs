using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Entities;
using MongoDB.Driver;

namespace ECommerceBackEnd.Repositories
{
    public class OrderDetailRepository: RepositoryBase<OrderDetail>,IOrderDetailRepository
    {
        public OrderDetailRepository (IMongoDatabase database,string collectionName) : base(database,collectionName) { }
        public IEnumerable<OrderDetail> GetDetailsForOrder(int orderId) => GetManyByCondition(c=>c.OrderId==orderId);
        public IEnumerable<OrderDetail> GetOrderDetailsForProduct(int productId) => GetManyByCondition(c=>c.ProductCardId ==productId);
        public void CreateOrderDetail(OrderDetail orderDetail) => Create(orderDetail);
        public void UpdateOrderDetail(OrderDetail orderDetail) => Update(c=>c.OrderItemId == orderDetail.OrderItemId,orderDetail);
        public void DeleteOrderDetail(OrderDetail orderDetail) => Delete(c=>c.OrderItemId == orderDetail.OrderItemId);
        public OrderDetail GetOrderDetailById(int id) => GetByCondition(c => c.OrderItemId == id);
        public OrderDetail GetDetailByProductAndOrder(int oid, int pid) => GetByCondition(c => c.ProductCardId == pid && c.OrderId == oid);
        public int GetLatestId() => GetAll().ToList().OrderByDescending(c => c.OrderItemId).FirstOrDefault().OrderItemId + 1;
        public void CreateManyOrderDetails(IEnumerable<OrderDetail> orderDetails)=>CreateMany(orderDetails);
    }
}
