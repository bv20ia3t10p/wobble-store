using ECommerceBackEnd.Entities;
using MongoDB.Bson;

namespace ECommerceBackEnd.Contracts
{
    public interface IOrderDetailRepository
    {
        IEnumerable<OrderDetail> GetDetailsForOrder(int orderId);
        IEnumerable<OrderDetail> GetOrderDetailsForProduct(int productId);
        void CreateOrderDetail (OrderDetail orderDetail);
        void UpdateOrderDetail (OrderDetail orderDetail);
        void DeleteOrderDetail (OrderDetail orderDetail);
        OrderDetail GetOrderDetailById (ObjectId OrderDetailId);
        OrderDetail GetDetailByProductAndOrder(int oid, int pid);
        void CreateManyOrderDetails (IEnumerable<OrderDetail> orderDetails);
        
    }
}
