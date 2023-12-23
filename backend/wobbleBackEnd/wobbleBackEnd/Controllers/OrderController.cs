using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using System.IdentityModel.Tokens.Jwt;

namespace ECommerceBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IServiceManager _service;
        public OrderController(IServiceManager service)
        {
            _service = service;
        }
        [HttpGet]
        [EnableQuery]

        public ActionResult<IEnumerable<OrderDto>> GetOrders() => Ok(_service.Order.GetOrders());
        [HttpGet("{id}")]
        public ActionResult<OrderDto> GetOrder(int id) => Ok(_service.Order.GetOrder(id));
        [HttpGet("Customer/{customerId}")]
        [EnableQuery]
        public ActionResult<IEnumerable<OrderDto>> GetOrders(int customerId)
        {
            return Ok(_service.Order.GetOrdersByCustomer(customerId));
        }
        [HttpGet("Customer/Email/")]
        [Authorize(Roles = "USER,ADMINISTRATOR")]
        [EnableQuery]
        public ActionResult<IEnumerable<OrderDto>> GetOrdersByEmail([FromHeader] string Authorization)
        {
            var token = Authorization.Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var customerInDb = _service.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            return Ok(_service.Order.GetOrdersByCustomer(customerInDb.CustomerId));
        }
        [HttpPost]
        public ActionResult<OrderDto> CreateOrder(CreateOrderDto newOrder)
        {
            var createdOrder = _service.Order.CreateOrder(newOrder);
            foreach (var od in newOrder.OrderDetails)
            {
                od.OrderId = createdOrder.OrderId;
                _service.OrderDetail.CreateOrderDetail(od);
            }
            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.OrderId }, _service.Order.GetOrder(createdOrder.OrderId));
        }
        [HttpPut("Status")]
        public ActionResult<OrderDto> UpdateOrderStatus(UpdateOrderStatusDto newOrderStatus)
        {
            var updatedOrder = _service.Order.UpdateOrderStatus(newOrderStatus);
            return Ok(updatedOrder);
        }
        [HttpDelete("{id}")]
        public ActionResult DeleteOrder(int id)
        {
            _service.Order.DeleteOrder(id);
            return NoContent();
        }
        [HttpGet("Customer")]
        [EnableQuery]
        public ActionResult<IEnumerable<OrderWithDetailsDto>> GetOrderWithDetailsForCustomerEmail([FromHeader] string Authorization)
        {
            var token = Authorization[7..];
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var customerInDb = _service.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            return Ok(_service.Order.GetOrdersWithDetailsForCustomer(customerInDb.CustomerEmail));
        }
        [HttpPost("Customer")]
        [Authorize(Roles = "USER")]
        public ActionResult<OrderWithDetailsDto> CreateOrderForCustomer([FromHeader] string Authorization, CreateOrderDto newOrder)
        {
            var token = Authorization[7..];
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var customerInDb = _service.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            //var createdOrder = _service.Order.CreateOrder(newOrder);
            double total = 0;
            foreach (var od in newOrder.OrderDetails)
            {
                //od.OrderId = createdOrder.OrderId;
                //od.CustomerId = customerInDb.CustomerId;
                //var createdOd = _service.OrderDetail.CreateOrderDetail(od);
                //total += createdOd.OrderItemTotal;
                var productInDb = _service.Product.GetProductById(od.ProductCardId) ?? throw new Exception("Product not found");
                total += od.OrderItemQuantity * productInDb.ProductPrice;
            }
            newOrder.Total = total;
            var createdOrder = _service.Order.CreateOrder(newOrder);
            foreach (var od in newOrder.OrderDetails)
            {
                od.OrderId = createdOrder.OrderId;
                od.CustomerId = customerInDb.CustomerId;
                var createdOd = _service.OrderDetail.CreateOrderDetail(od);
            }
            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.OrderId }, _service.Order.GetOrderWithDetails(createdOrder.OrderId));
        }
        [HttpPut("Customer")]
        [Authorize(Roles = "USER")]
        public ActionResult<OrderWithDetailsDto> UpdateOrderPaymentStatus([FromHeader] string Authorization, UpdateOrderPaymentDto newOrder)
        {
            var token = Authorization[7..];
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var customerInDb = _service.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            var orderInDb = _service.Order.GetOrder(newOrder.OrderId);
            if (orderInDb.CustomerId != customerInDb.CustomerId) return Unauthorized();
            _service.Order.UpdateOrderPaymentStatus(newOrder);
            return Ok(_service.Order.GetOrderWithDetails(newOrder.OrderId));
        }
        [HttpGet("{orderId}/Customer")]
        [Authorize(Roles = "USER")]
        public ActionResult<OrderWithDetailsDto> GetOrderForCustomer(int orderId, [FromHeader] string Authorization)
        {
            var token = Authorization[7..];
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var customerInDb = _service.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            var orderInDb = _service.Order.GetOrderWithDetails(orderId);
            if (customerInDb.CustomerId != orderInDb.CustomerId) return Unauthorized();
            return Ok(orderInDb);
        }
    }
}
