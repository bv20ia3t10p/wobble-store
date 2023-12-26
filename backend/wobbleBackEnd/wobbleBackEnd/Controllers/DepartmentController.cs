using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Repositories;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ECommerceBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IServiceManager _service;
        public DepartmentController(IServiceManager service) => _service = service;

        // GET: api/<DepartmentController>
        [HttpGet]
        public ActionResult<IEnumerable<DepartmentDto>> Get()
        {
            return Ok(_service.Department.GetDepartments());
        }


        // GET api/<DepartmentController>/5
        [HttpGet("{id}")]
        public ActionResult<DepartmentDto> Get(int id)
        {
            return Ok(_service.Department.GetDepartmentById(id));
        }

        // POST api/<DepartmentController>
        [Authorize(Roles = ("ADMINISTRATOR"))]
        [HttpPost]
        public ActionResult<DepartmentDto> Post([FromBody] CreateDepartmentDto value)
        {

            var department = _service.Department.CreateDepartment(value);
            return CreatedAtAction(nameof(Get), new { id = department.DepartmentId }, value);
        }
        // PUT api/<DepartmentController>/5
        [HttpPut]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult Put(UpdateDepartmentDto updateDep)
        {
            _service.Department.UpdateDepartment(updateDep);
            return Ok(_service.Department.GetDepartmentById(updateDep.DepartmentId));
        }

        // DELETE api/<DepartmentController>/5
        [HttpDelete("{id}")]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult Delete(int id)
        {
            _service.Department.DeleteDepartmentById(id);
            return NoContent();
        }
    }
}
