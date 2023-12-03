using ECommerceBackEnd.Entities;

namespace ECommerceBackEnd.Contracts
{
    public interface IOrderDetailRepository
    {
        IEnumerable<OrderDetail> GetDetailsForOrder(int orderId);
        IEnumerable<OrderDetail> GetOrderDetailsForProduct(int productId);
        void CreateOrderDetail (OrderDetail orderDetail);
        void UpdateOrderDetail (OrderDetail orderDetail);
        void DeleteOrderDetail (OrderDetail orderDetail);
        OrderDetail GetOrderDetailById (int OrderDetailId);
        OrderDetail GetDetailByProductAndOrder(int oid, int pid);
        int GetLatestId();
        void CreateManyOrderDetails (IEnumerable<OrderDetail> orderDetails);
        
    }
}
