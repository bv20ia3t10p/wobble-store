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
    public class CustomerController : ControllerBase
    {
        private readonly IServiceManager _services;
        public CustomerController(IServiceManager services)
        {
            _services = services;
        }

        [Authorize]
        [HttpGet]
        [EnableQuery]
        public ActionResult<IEnumerable<CustomerDTO>> Get() => Ok(_services.Customer.GetCustomers());
        [HttpGet("{id}", Name = "GetCustomerById")]
        public ActionResult<CustomerDTO> GetById(int id) => Ok(_services.Customer.GetCustomerById(id));
        [HttpPut]
        public ActionResult<CustomerDTO> Replace(UpdateCustomerDto newCustomer) => Ok(_services.Customer.UpdateCustomer(newCustomer));
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _services.Customer.DeleteCustomerById(id);
            return NoContent();
        }
        [HttpPost]
        public ActionResult<CustomerDTO> Create(CustomerDTO newCustomer)
        {
            var newCustomerEntity = new CustomerDTO();
            try
            {
                newCustomerEntity = _services.Customer.CreateCustomer(newCustomer);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
            return CreatedAtAction(nameof(GetById), new { id = newCustomerEntity.CustomerId }, _services.Customer.GetCustomerById(newCustomerEntity.CustomerId));
        }
        [HttpPost("UpdateMultiplePW")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public ActionResult<IEnumerable<CustomerDTO>> UpdateMultipleCustomerPasswords(string newPw)
        {
            _services.Customer.UpdateMultipleCustomerPassword(newPw);
            return Ok(_services.Customer.GetCustomers());
        }
        [HttpGet("Email")]
        [Authorize(Roles = "ADMINISTRATOR,USER")]
        public ActionResult<CustomerDTO> GetCustomerByEmail([FromHeader] string Authorization)
        {
            var token = Authorization.Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var customerInDb = _services.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            return Ok(customerInDb);
        }
        [HttpPut("Update")]
        [Authorize(Roles = "ADMINISTRATOR,USER")]
        public ActionResult<CustomerDTO> UpdateCurrentCustomerInfo([FromHeader] string Authorization, [FromBody] UpdateCustomerDto updateCustomerDto)
        {
            var token = Authorization.Substring(7);
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var email = jwtSecurityToken.Claims.First(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
            var customerInDb = _services.Customer.GetCustomerByEmail(email);
            if (customerInDb == null) return Unauthorized();
            var updatedCustomer = _services.Customer.UpdateCustomer(updateCustomerDto);
            return Ok(updatedCustomer);
        }
    }
}
