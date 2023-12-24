using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using wobbleBackEnd.Dtos;
using wobbleBackEnd.Entities;

namespace wobbleBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffsController : ControllerBase
    {
        private readonly IServiceManager _service;
        public StaffsController(IServiceManager service)
        {
            _service = service;
        }

        [HttpGet("{id}")]  
        public ActionResult<Staff> GetStaffById(int id) {
           return Ok( _service.Staff.GetStaffById(id));
        }
        [HttpGet]
        public ActionResult<IEnumerable<Staff>> GetStaffs()
        {
            return Ok(_service.Staff.GetStaves());
        }
        [HttpDelete("{id}")]
        public ActionResult DeleteStaff(int id)
        {
            _service.Staff.DeleteStaff(id);
            return NoContent();
        }
        [HttpPost]
        public ActionResult<Staff> CreateStaff(CreateStaffDto newStaff) => Ok(_service.Staff.CreateStaff(newStaff));
        [HttpPut]
        public ActionResult<Staff> UpdateStaff(UpdateStaffDto newStaff)=>Ok(_service.Staff.UpdateStaff(newStaff));

    }
}
