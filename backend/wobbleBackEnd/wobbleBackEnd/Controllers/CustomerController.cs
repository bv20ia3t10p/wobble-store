using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.WebUtilities;
using System.IdentityModel.Tokens.Jwt;
using wobbleBackEnd.Service.Contracts;

namespace ECommerceBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IServiceManager _services;
        private readonly IUriService _uriService;
        public CustomerController(IServiceManager services, IUriService uriService)
        {
            _services = services;
            _uriService = uriService;
        }
        [HttpGet("/alt")]
        public Uri AppendQueryParams(Uri modifiedPage, int? CustomerId,
            string? CustomerCity,
            string? CustomerCountry,
            string? CustomerFname,
            string? CustomerLname,
            string? CustomerSegment,
            string? CustomerState,
            string? CustomerStreet,
            string? CustomerEmail,
            int? CustomerZipcode,
            bool? orderByIdAsc,
            bool? orderByCountryAsc,
            bool? orderByCityAsc,
            bool? orderByFnameAsc,
            bool? orderByLnameAsc,
            bool? orderByStateAsc,
            bool? orderbyStreetAsc,
            bool? orderByZipcodeAsc)
        {
            if (CustomerId is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerId), CustomerId.ToString()));
            }
            if (CustomerCity is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerCity), CustomerCity.ToString()));
            }
            if (CustomerCountry is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerCountry), CustomerCountry.ToString()));
            }
            if (CustomerFname is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerFname), CustomerFname.ToString()));
            }
            if (CustomerSegment is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerSegment), CustomerSegment.ToString()));
            }
            if (CustomerState is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerState), CustomerState.ToString()));
            }
            if (CustomerLname is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerLname), CustomerLname.ToString()));
            }
            if (CustomerEmail is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerEmail), CustomerEmail.ToString()));
            }
            if (CustomerStreet is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerStreet), CustomerStreet.ToString()));
            }
            if (CustomerZipcode is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(CustomerZipcode), CustomerZipcode.ToString()));
            }
            if (orderByIdAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByIdAsc), orderByIdAsc.ToString()));
            }
            if (orderByCountryAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByCountryAsc), orderByCountryAsc.ToString()));
            }
            if (orderByFnameAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByFnameAsc), orderByFnameAsc.ToString()));
            }
            if (orderByCityAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByCityAsc), orderByCityAsc.ToString()));
            }
            if (orderByLnameAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByLnameAsc), orderByLnameAsc.ToString()));
            }
            if (orderByStateAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByStateAsc), orderByStateAsc.ToString()));
            }
            if (orderbyStreetAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderbyStreetAsc), orderbyStreetAsc.ToString()));
            }
            if (orderByZipcodeAsc is not null)
            {
                modifiedPage = new Uri(QueryHelpers.AddQueryString(modifiedPage.ToString(), nameof(orderByZipcodeAsc), orderByZipcodeAsc.ToString()));
            }
            return modifiedPage;
        }

        [Authorize(Roles = ("ADMINISTRATOR"))]
        [HttpGet]
        [EnableQuery]
        public ActionResult<IEnumerable<CustomerDTO>> Get(
            int PageNumber,
            int PageSize,
            int? CustomerId,
            string? CustomerCity,
            string? CustomerCountry,
            string? CustomerFname,
            string? CustomerLname,
            string? CustomerSegment,
            string? CustomerState,
            string? CustomerStreet,
                        string? CustomerEmail,
            int? CustomerZipcode,
            bool? orderByIdAsc,
            bool? orderByCountryAsc,
            bool? orderByCityAsc,
            bool? orderByFnameAsc,
            bool? orderByLnameAsc,
            bool? orderByStateAsc,
            bool? orderbyStreetAsc,
            bool? orderByZipcodeAsc
            )
        {
            var returnCustomers = _services.Customer.GetCustomers();
            if (CustomerId != null) returnCustomers = returnCustomers.Where(c => c.CustomerId.Equals(CustomerId)).ToList();
            if (CustomerCity != null) returnCustomers = returnCustomers.Where(c => c.CustomerCity.ToLower().Contains(CustomerCity.ToLower())).ToList();
            if (CustomerCountry != null) returnCustomers = returnCustomers.Where(c => c.CustomerCountry.ToLower().Contains(CustomerCountry.ToLower())).ToList();
            if (CustomerFname != null) returnCustomers = returnCustomers.Where(c => c.CustomerFname.ToLower().Contains(CustomerFname.ToLower())).ToList();
            if (CustomerLname != null) returnCustomers = returnCustomers.Where(c => c.CustomerLname.ToLower().Contains(CustomerLname.ToLower())).ToList();
            if (CustomerSegment != null) returnCustomers = returnCustomers.Where(c => c.CustomerSegment.Equals(CustomerSegment)).ToList();
            if (CustomerState != null) returnCustomers = returnCustomers.Where(c => c.CustomerState.ToLower().Contains(CustomerState.ToLower())).ToList();
            if (CustomerStreet != null) returnCustomers = returnCustomers.Where(c => c.CustomerStreet.ToLower().Contains(CustomerStreet.ToLower())).ToList();
            if (CustomerEmail != null) returnCustomers = returnCustomers.Where(c => c.CustomerEmail.ToLower().Contains(CustomerEmail.ToLower())).ToList();
            if (CustomerZipcode != null) returnCustomers = returnCustomers.Where(c => c.CustomerZipcode.Equals(CustomerZipcode)).ToList();
            if (orderByIdAsc != null) returnCustomers = (bool)orderByIdAsc ? returnCustomers.OrderBy(c => c.CustomerId) : returnCustomers.OrderByDescending(c => c.CustomerId);
            if (orderByCityAsc != null) returnCustomers = (bool)orderByCityAsc ? returnCustomers.OrderBy(c => c.CustomerCity) : returnCustomers.OrderByDescending(c => c.CustomerCity);
            if (orderByCountryAsc != null) returnCustomers = (bool)orderByCountryAsc ? returnCustomers.OrderBy(c => c.CustomerCountry) : returnCustomers.OrderByDescending(c => c.CustomerCountry);
            if (orderByFnameAsc != null) returnCustomers = (bool)orderByFnameAsc ? returnCustomers.OrderBy(c => c.CustomerFname) : returnCustomers.OrderByDescending(c => c.CustomerFname);
            if (orderByLnameAsc != null) returnCustomers = (bool)orderByLnameAsc ? returnCustomers.OrderBy(c => c.CustomerLname) : returnCustomers.OrderByDescending(c => c.CustomerLname);
            if (orderByStateAsc != null) returnCustomers = (bool)orderByStateAsc ? returnCustomers.OrderBy(c => c.CustomerState) : returnCustomers.OrderByDescending(c => c.CustomerState);
            if (orderbyStreetAsc != null) returnCustomers = (bool)orderbyStreetAsc ? returnCustomers.OrderBy(c => c.CustomerStreet) : returnCustomers.OrderByDescending(c => c.CustomerStreet);
            if (orderByZipcodeAsc != null) returnCustomers = (bool)orderByZipcodeAsc ? returnCustomers.OrderBy(c => c.CustomerZipcode) : returnCustomers.OrderByDescending(c => c.CustomerZipcode);
            var route = Request.Path.Value;
            var validFilter = new PaginationFilter(PageNumber, PageSize);
            var pagedData = returnCustomers.Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();
            var totalRecords = returnCustomers.Count();
            var pagedResponse = Extension.CreatePagedReponse<CustomerDTO>(pagedData, validFilter, totalRecords, _uriService, route);
            if (pagedResponse.PreviousPage != null) pagedResponse.PreviousPage = AppendQueryParams(pagedResponse.PreviousPage, CustomerId, CustomerCity, CustomerCountry,
                CustomerFname, CustomerLname, CustomerSegment, CustomerState, CustomerStreet, CustomerEmail, CustomerZipcode, orderByIdAsc, orderByCountryAsc, orderByCityAsc, orderByFnameAsc,
                orderByLnameAsc, orderByStateAsc, orderbyStreetAsc, orderByZipcodeAsc);
            if (pagedResponse.NextPage != null) pagedResponse.NextPage = AppendQueryParams(pagedResponse.NextPage, CustomerId, CustomerCity, CustomerCountry,
    CustomerFname, CustomerLname, CustomerSegment, CustomerState, CustomerStreet, CustomerEmail, CustomerZipcode, orderByIdAsc, orderByCountryAsc, orderByCityAsc, orderByFnameAsc,
    orderByLnameAsc, orderByStateAsc, orderbyStreetAsc, orderByZipcodeAsc);
            if (pagedResponse.FirstPage != null) pagedResponse.FirstPage = AppendQueryParams(pagedResponse.FirstPage, CustomerId, CustomerCity, CustomerCountry,
CustomerFname, CustomerLname, CustomerSegment, CustomerState, CustomerStreet, CustomerEmail, CustomerZipcode, orderByIdAsc, orderByCountryAsc, orderByCityAsc, orderByFnameAsc,
orderByLnameAsc, orderByStateAsc, orderbyStreetAsc, orderByZipcodeAsc);
            if (pagedResponse.LastPage != null) pagedResponse.LastPage = AppendQueryParams(pagedResponse.LastPage, CustomerId, CustomerCity, CustomerCountry,
CustomerFname, CustomerLname, CustomerSegment, CustomerState, CustomerStreet, CustomerEmail, CustomerZipcode, orderByIdAsc, orderByCountryAsc, orderByCityAsc, orderByFnameAsc,
orderByLnameAsc, orderByStateAsc, orderbyStreetAsc, orderByZipcodeAsc);
            return Ok(pagedResponse);
        }
        [HttpGet("{id}", Name = "GetCustomerById")]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult<CustomerDTO> GetById(int id) => Ok(_services.Customer.GetCustomerById(id));
        [HttpPut]
        [Authorize(Roles = ("ADMINISTRATOR"))]
        public ActionResult<CustomerDTO> Replace(UpdateCustomerDto newCustomer) => Ok(_services.Customer.UpdateCustomer(newCustomer));
        [HttpDelete("{id}")]
        [Authorize(Roles = ("ADMINISTRATOR"))]
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
            catch (Exception ex)
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
