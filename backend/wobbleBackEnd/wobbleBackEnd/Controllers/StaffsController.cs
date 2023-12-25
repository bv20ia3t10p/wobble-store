using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;
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
        [Authorize(Roles = "ADMINISTRATOR")]

        public ActionResult<Staff> GetStaffById(int id) {
           return Ok( _service.Staff.GetStaffById(id));
        }
        [HttpGet]
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult<IEnumerable<Staff>> GetStaffs()
        {
            return Ok(_service.Staff.GetStaves());
        }
        [HttpDelete("{id}")]
        [Authorize(Roles ="ADMINISTRATOR")]
        public ActionResult DeleteStaff(int id)
        {
            _service.Staff.DeleteStaff(id);
            return NoContent();
        }
        [HttpGet("Check")]
        [Authorize]
        public bool CheckIfStaff([FromHeader] String Authorization) {
            return _service.Staff.GetStaffByEmail(ECommerceBackEnd.Extension.ExtractEmailFromToken(Authorization)) != null;
        }
        [HttpPost]
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult<Staff> CreateStaff(CreateStaffDto newStaff) => Ok(_service.Staff.CreateStaff(newStaff));
        [HttpPut]
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult<Staff> UpdateStaff(UpdateStaffDto newStaff)=>Ok(_service.Staff.UpdateStaff(newStaff));

    }
}
