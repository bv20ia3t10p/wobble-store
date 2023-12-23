using AutoMapper;
using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Service.Contracts;

namespace ECommerceBackEnd.Service
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly IRepositoryManager _repository;
        public OrderService(IMapper mapper, IRepositoryManager repository)
        {
            _mapper = mapper;
            _repository = repository;
        }
        public IEnumerable<OrderDto> GetOrders() => _mapper.Map<IEnumerable<OrderDto>>(_repository.Order.GetOrders());
        public IEnumerable<OrderDto> GetOrdersByCustomer(int id) => _mapper.Map<IEnumerable<OrderDto>>(_repository.Order.GetOrdersByCustomer(id));
        public OrderDto GetOrder(int id)
        {
            var order = _mapper.Map<OrderDto>(_repository.Order.GetOrderById(id));
            return order;
        }

        public OrderDto UpdateOrderStatus(UpdateOrderStatusDto updateOrderStatus)
        {
            var orderInDb = _repository.Order.GetOrderById(updateOrderStatus.OrderId);
            if (orderInDb == null)
            {
                throw new Exception("Order not found");
            }
            _mapper.Map(updateOrderStatus, orderInDb);
            _repository.Order.UpdateOrder(orderInDb);
            return _mapper.Map<OrderDto>(orderInDb);
        }
        public void DeleteOrder(int id)
        {
            var orderInDb = _repository.Order.GetOrderById(id);
            if (orderInDb == null)
            {
                throw new Exception("Order not found");
            }
            _repository.Order.DeleteOrder(orderInDb);
        }
        public OrderDto CreateOrder(CreateOrderDto newOrder)
        {
            int latestId = _repository.Order.GetLatestId();
            var orderEntity = _mapper.Map<Order>(newOrder);
            var customerInDb = _repository.Customer.GetCustomerById(newOrder.CustomerId);
            if (customerInDb != null)
            {
                // This also maps Customer entity object ID to Order Id so we gotta override that by generating new object ID manually, usually this is done by automapper
                _mapper.Map(customerInDb, orderEntity);
            }
            orderEntity.OrderId = latestId;
            orderEntity.Id = new MongoDB.Bson.ObjectId();
            orderEntity.OrderDate = DateTime.Now;
            orderEntity.ShippingDate = DateTime.Now.AddDays(3);
            orderEntity.ShippingMode = "Standard Class";
            orderEntity.OrderStatus = "Pending";
            orderEntity.LateDeliveryRisk = 0;
            orderEntity.DeliveryStatus = "Shipping on time";
            _repository.Order.CreateOrder(orderEntity);
            return _mapper.Map<OrderDto>(orderEntity);
        }
        public OrderWithDetailsDto GetOrderWithDetails(int id)
        {
            var orderInDb = _repository.Order.GetOrderById(id) ?? throw new Exception("Order not found");
            var returnOrder = _mapper.Map<OrderWithDetailsDto>(orderInDb);
            returnOrder.Details = _mapper.Map<IEnumerable<OrderDetailDto>>(_repository.OrderDetail.GetDetailsForOrder(orderInDb.OrderId));
            return returnOrder;
        }
        public IEnumerable<OrderWithDetailsDto> GetOrdersWithDetailsForCustomer(string email)
        {
            var customerInDb = _repository.Customer.GetCustomerByEmail(email) ?? throw new Exception("Customer not found");
            var returnOrders = _mapper.Map<IEnumerable<OrderWithDetailsDto>>(_repository.Order.GetOrdersByCustomer(customerInDb.CustomerId));
            foreach (var order in returnOrders)
            {
                order.Details = _mapper.Map<IEnumerable<OrderDetailDto>>(_repository.OrderDetail.GetDetailsForOrder(order.OrderId));
            }

            return returnOrders.OrderByDescending(c=>c.OrderId);
        }
        public void UpdateOrderPaymentStatus (UpdateOrderPaymentDto updateOrderPayment)
        {
            var orderInDb = _repository.Order.GetOrderById(updateOrderPayment.OrderId) ?? throw new Exception("Order not found");
            _mapper.Map(updateOrderPayment, orderInDb);
            _repository.Order.UpdateOrder(orderInDb);
        }
    }
}
