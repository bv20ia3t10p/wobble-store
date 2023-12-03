using ECommerceBackEnd.Dtos;

namespace ECommerceBackEnd.Service.Contracts
{
    public interface IOrderDetailService
    {
        IEnumerable<OrderDetailDto> CreateMultipleOrderDetails(IEnumerable<CreateOrderDetailDto> orderDetails);
        OrderDetailDto CreateOrderDetail(CreateOrderDetailDto orderDetailDto);
        void DeleteOrderDetail(int id);
        IEnumerable<OrderDetailDto> GetByOrder(int orderId);
        OrderDetailDto GetByOrderAndProduct(int oid, int pid);
        IEnumerable<OrderDetailDto> GetByProduct(int productId);
        OrderDetailDto UpdateOrderDetail(UpdateOrderDetailDto orderDetail);
        OrderDetailDto GetById(int id);
    }
}