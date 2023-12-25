using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace ECommerceBackEnd.Controllers
{
    [Route("api/[Controller]")]

    public class OrderDetailController : ControllerBase
    {
        private IServiceManager _service;
        public OrderDetailController(IServiceManager service)
        {
            _service = service;
        }
        [HttpGet("/api/Order/{oid}/Details")]
        [EnableQuery]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult<IEnumerable<OrderDetailDto>> GetDetailsForOrder(int oid) => Ok(_service.OrderDetail.GetByOrder(oid));
        [HttpGet("/api/Product/{pid}/Details")]
        [EnableQuery]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult<IEnumerable<OrderDetailDto>> GetDetailsForProduct(int pid) => Ok(_service.OrderDetail.GetByProduct(pid));
        [HttpGet("{id}")]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult<OrderDetailDto> GetById(int id) => Ok(_service.OrderDetail.GetById(id));
        [HttpDelete("{id}")]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult DeleteOrderDetail(int id)
        {
            _service.OrderDetail.DeleteOrderDetail(id);
            return NoContent();
        }
        [Authorize(Roles = ("ADMINISTRATOR"))]
        [HttpPost]
        public ActionResult<OrderDto> AddOrderDetail([FromBody] CreateOrderDetailDto newOd)
        {
            var createdOd = _service.OrderDetail.CreateOrderDetail(newOd);
            return CreatedAtAction(nameof(GetById), new { id = createdOd.OrderItemId} , createdOd);
        }
        [HttpPut]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult<OrderDto> UpdateOrderDetail([FromBody] UpdateOrderDetailDto newOd) => Ok(_service.OrderDetail.UpdateOrderDetail(newOd));
    }
}
