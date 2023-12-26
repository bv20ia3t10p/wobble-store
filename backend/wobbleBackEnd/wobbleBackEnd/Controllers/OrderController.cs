using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Attributes;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json.Converters;
using System.IdentityModel.Tokens.Jwt;
using wobbleBackEnd.Service.Contracts;

namespace ECommerceBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IServiceManager _service;
        private readonly IUriService _uriService;
        public OrderController(IServiceManager service, IUriService uriService)
        {
            _service = service;
            _uriService = uriService;
        }
        private Uri AppendParamsAsQueryString(Uri modifiedPage, string? CustomerFullName, int? CustomerId, string? CustomerFname, string? CustomerLname, string? CustomerEmail, string? ProductName, double? OrderDateGreaterThan, double? OrderDateSmallerThan, double? totalGtThan, double? totalSmallerThan, bool? sortByOrderDateAscending,

            bool? sortByOrderDateDescending, bool? sortByTotalDescending, bool? sortByTotalAscending, string? Type, string? OrderStatus, string? ShippingMode, string? DeliveryStatus)
        {
            if (CustomerId is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerId), CustomerId.ToString()));
            }
            if (CustomerFullName is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerFullName), CustomerFullName.ToString()));
            }
            if (CustomerFname is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerFname), CustomerFname.ToString()));
            }
            if (CustomerLname is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerLname), CustomerLname.ToString()));
            }
            if (CustomerEmail is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerEmail), CustomerEmail.ToString()));
            }
            if (totalGtThan is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(totalGtThan), totalGtThan.ToString()));
            }
            if (totalSmallerThan is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(totalSmallerThan), totalSmallerThan.ToString()));
            }
            if (sortByOrderDateAscending is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(sortByOrderDateAscending), sortByOrderDateAscending.ToString()));
            }
            if (sortByOrderDateDescending is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(sortByOrderDateDescending), sortByOrderDateDescending.ToString()));
            }
            if (sortByTotalAscending is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(sortByTotalAscending), sortByTotalAscending.ToString()));
            }
            if (sortByTotalDescending is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(sortByTotalDescending), sortByTotalDescending.ToString()));
            }
            if (Type is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(Type), Type.ToString()));

            }
            if (OrderStatus is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(OrderStatus), OrderStatus.ToString()));

            }
            if (ShippingMode is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(ShippingMode), ShippingMode.ToString()));

            }
            if (DeliveryStatus is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(DeliveryStatus), DeliveryStatus.ToString()));

            }
            return modifiedPage;
        }
        [EnableQuery]
        [Authorize(Roles = "ADMINISTRATOR")]
        [HttpGet]
        public ActionResult<IEnumerable<OrderDto>> GetOrders(int PageNumber, int PageSize, string? CustomerFullName, int? CustomerId, string? CustomerFname, string? CustomerLname, string? CustomerEmail, string? ProductName, double? OrderDateGreaterThan, double? OrderDateSmallerThan, double? totalGtThan, double? totalSmallerThan, bool? sortByOrderDateAscending,

            bool? sortByOrderDateDescending, bool? sortByTotalDescending, bool? sortByTotalAscending, string? Type, string? OrderStatus, string? ShippingMode, string? DeliveryStatus)
        {
            var returnOrders = _service.Order.GetOrders();
            Console.WriteLine("Got order");
            if (OrderDateGreaterThan is not null)
            {
                DateTime gtDate = Extension.UnixTimeStampToDateTime((double)OrderDateGreaterThan);
                returnOrders = returnOrders.Where((o) => o.OrderDate >= gtDate);
            }
            if (OrderDateSmallerThan is not null)
            {
                if (OrderDateSmallerThan >= OrderDateGreaterThan)
                {
                    DateTime lsDate = Extension.UnixTimeStampToDateTime((double)OrderDateSmallerThan);
                    returnOrders = returnOrders.Where((o) => o.OrderDate <= lsDate);
                }
            }
            if (CustomerId is not null)
            {
                returnOrders = returnOrders.Where(c => c.CustomerId == CustomerId);
            }
            if (CustomerFname is not null)
            {
                returnOrders = returnOrders.Where(c => c.CustomerFname.ToLower().Contains(CustomerFname.ToLower()));
            }
            if (CustomerFullName is not null)
            {
                returnOrders = returnOrders.Where(c => c.CustomerFname.ToLower().Contains(CustomerFullName.ToLower()));
            }
            if (CustomerLname is not null)
            {
                returnOrders = returnOrders.Where(c => c.CustomerLname.ToLower().Contains(CustomerLname.ToLower()));
            }
            if (CustomerEmail is not null)
            {
                returnOrders = returnOrders.Where(c => c.CustomerEmail.ToLower().Contains(CustomerEmail.ToLower()));
            }
            if (totalGtThan is not null)
            {
                returnOrders = returnOrders.Where((o) => o.Total >= totalGtThan);
            }
            if (totalSmallerThan is not null)
            {
                returnOrders = returnOrders.Where((o) => o.Total <= totalSmallerThan);
            }
            if (sortByOrderDateAscending is not null)
            {
                returnOrders = returnOrders.OrderBy((e) => e.OrderDate);
            }
            if (sortByOrderDateDescending is not null)
            {
                returnOrders = returnOrders.OrderByDescending((e) => e.OrderDate);
            }
            if (sortByTotalAscending is not null)
            {
                returnOrders = returnOrders.OrderBy(e => e.Total);
            }
            if (sortByTotalDescending is not null)
            {
                returnOrders = returnOrders.OrderByDescending(e => e.Total);
            }
            if (Type is not null)
            {
                returnOrders = returnOrders.Where(c => c.Type.Equals(Type));
            }
            if (OrderStatus is not null)
            {
                returnOrders = returnOrders.Where(c => c.OrderStatus.Equals(OrderStatus));
            }
            if (DeliveryStatus is not null)
            {
                returnOrders = returnOrders.Where(c => c.DeliveryStatus.Equals(DeliveryStatus));
            }
            if (ShippingMode is not null)
            {
                returnOrders = returnOrders.Where(c => c.ShippingMode.Equals(ShippingMode));
            }
            var route = Request.Path.Value;
            var validFilter = new PaginationFilter(PageNumber, PageSize);
            var pagedData = returnOrders.Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();
            var totalRecords = returnOrders.Count();
            var pagedResponse = Extension.CreatePagedReponse<OrderDto>(pagedData, validFilter, totalRecords, _uriService, route);
            if (pagedResponse.FirstPage is not null)
                pagedResponse.FirstPage = AppendParamsAsQueryString(pagedResponse.FirstPage, CustomerFullName, CustomerId, CustomerFname, CustomerLname
                    , CustomerEmail, ProductName, OrderDateGreaterThan, OrderDateSmallerThan, totalGtThan, totalSmallerThan, sortByOrderDateAscending,
                sortByOrderDateDescending, sortByTotalDescending, sortByTotalAscending, Type, OrderStatus, ShippingMode, DeliveryStatus);
            if (pagedResponse.LastPage is not null)
                pagedResponse.LastPage = AppendParamsAsQueryString(pagedResponse.LastPage, CustomerFullName, CustomerId, CustomerFname, CustomerLname
                    , CustomerEmail, ProductName, OrderDateGreaterThan, OrderDateSmallerThan, totalGtThan, totalSmallerThan, sortByOrderDateAscending,
                sortByOrderDateDescending, sortByTotalDescending, sortByTotalAscending, Type, OrderStatus, ShippingMode, DeliveryStatus);
            if (pagedResponse.NextPage is not null)
                pagedResponse.NextPage = AppendParamsAsQueryString(pagedResponse.NextPage, CustomerFullName, CustomerId, CustomerFname, CustomerLname
                    , CustomerEmail, ProductName, OrderDateGreaterThan, OrderDateSmallerThan, totalGtThan, totalSmallerThan, sortByOrderDateAscending,
                sortByOrderDateDescending, sortByTotalDescending, sortByTotalAscending, Type, OrderStatus, ShippingMode, DeliveryStatus);
            if (pagedResponse.PreviousPage is not null)
                pagedResponse.PreviousPage = AppendParamsAsQueryString(pagedResponse.PreviousPage, CustomerFullName, CustomerId, CustomerFname, CustomerLname
                    , CustomerEmail, ProductName, OrderDateGreaterThan, OrderDateSmallerThan, totalGtThan, totalSmallerThan, sortByOrderDateAscending,
                sortByOrderDateDescending, sortByTotalDescending, sortByTotalAscending, Type, OrderStatus, ShippingMode, DeliveryStatus);
            return Ok(pagedResponse);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult<OrderDto> GetOrder(int id) => Ok(_service.Order.GetOrder(id));
        [HttpGet("Customer/{customerId}")]
        public ActionResult<IEnumerable<OrderDto>> GetOrders(int customerId)
        {
            return Ok(_service.Order.GetOrdersByCustomer(customerId));
        }
        [HttpGet("Customer/Email/")]
        [Authorize(Roles = "USER,ADMINISTRATOR")]
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
        [Authorize(Roles = "ADMINISTRATOR")]
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
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult<OrderDto> UpdateOrderStatus(UpdateOrderStatusDto newOrderStatus)
        {
            var updatedOrder = _service.Order.UpdateOrderStatus(newOrderStatus);
            return Ok(updatedOrder);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult DeleteOrder(int id)
        {
            _service.Order.DeleteOrder(id);
            return NoContent();
        }
        [EnableQuery]
        [HttpGet("Customer")]
        [Authorize(Roles = "USER,ADMINISTRATOR")]
        public ActionResult<IEnumerable<OrderWithDetailsDto>> GetOrderWithDetailsForCustomerEmail([FromHeader] string Authorization,
            string? ProductName, double? OrderDateGreaterThan, double? OrderDateSmallerThan, double? totalGtThan, double? totalSmallerThan, bool? sortByOrderDateAscending,
            bool? sortByOrderDateDescending, bool? sortByTotalDescending, bool? sortByTotalAscending, string? ShippingMode, string? DeliveryStatus
            )
        {
            var email = Extension.ExtractEmailFromToken(Authorization);
            var customerInDb = _service.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            var returnOrders = _service.Order.GetOrdersWithDetailsForCustomer(customerInDb.CustomerEmail);
            if (ProductName is not null)
            {
                returnOrders = returnOrders.Where((o) => o.Details.Where(od => od.ProductName == ProductName).Any()).ToList();
            }
            if (OrderDateGreaterThan is not null)
            {
                DateTime gtDate = Extension.UnixTimeStampToDateTime((double)OrderDateGreaterThan);
                returnOrders = returnOrders.Where((o) => o.OrderDate >= gtDate).ToList();
            }
            if (OrderDateSmallerThan is not null)
            {
                if (OrderDateSmallerThan >= OrderDateGreaterThan)
                {
                    DateTime lsDate = Extension.UnixTimeStampToDateTime((double)OrderDateSmallerThan);
                    returnOrders = returnOrders.Where((o) => o.OrderDate <= lsDate).ToList();
                }
            }
            if (totalGtThan is not null)
            {
                returnOrders = returnOrders.Where((o) => o.Total >= totalGtThan).ToList();
                Console.WriteLine(returnOrders);
            }
            if (totalSmallerThan is not null)
            {
                returnOrders = returnOrders.Where((o) => o.Total <= totalSmallerThan).ToList();
            }
            if (sortByOrderDateAscending is not null)
            {
                returnOrders = returnOrders.OrderBy((e) => e.OrderDate).ToList();
            }
            if (sortByOrderDateDescending is not null)
            {
                returnOrders = returnOrders.OrderByDescending((e) => e.OrderDate).ToList();
            }
            if (sortByTotalAscending is not null)
            {
                returnOrders = returnOrders.OrderBy(e => e.Total).ToList();
            }
            if (sortByTotalDescending is not null)
            {
                returnOrders = returnOrders.OrderByDescending(e => e.Total).ToList();
            }
            return Ok(returnOrders);
        }
        [HttpPost("Customer")]
        [Authorize(Roles = "USER,ADMINISTRATOR")]
        public ActionResult<Order> CreateOrderForCustomer([FromHeader] string Authorization, CreateOrderDto newOrder)
        {
            var token = Authorization[7..];
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var customerInDb = _service.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            //var createdOrder = _service.Order.CreateOrder(newOrder);
            var createdOrder = _service.Order.CreateOrder(newOrder);
            foreach (var od in newOrder.OrderDetails)
            {
                od.OrderId = createdOrder.OrderId;
                od.CustomerId = customerInDb.CustomerId;
                _service.OrderDetail.CreateOrderDetailWithOrder(od, createdOrder);
            }
            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.OrderId }, _service.Order.GetOrder(createdOrder.OrderId));
        }
        [HttpPut("Customer")]
        [Authorize(Roles = "USER,ADMINISTRATOR")]
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
        [Authorize(Roles = "USER,ADMINISTRATOR")]
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
        [HttpGet("WithDetails/{orderId}")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult<OrderWithDetailsDto> GetOrderWithDetailsForAdmin(int orderId)
        {
            var orderInDb = _service.Order.GetOrderWithDetails(orderId);
            return Ok(orderInDb);
        }
    }
}
