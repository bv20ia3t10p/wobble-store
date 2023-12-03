using ECommerceBackEnd.Dtos;

namespace ECommerceBackEnd.Service.Contracts
{
    public interface ICustomerService
    {
        IEnumerable<CustomerDTO> GetCustomers();
        CustomerDTO GetCustomerById(int id);
        CustomerDTO CreateCustomer(CustomerDTO newCustomer);
        CustomerDTO UpdateCustomer(UpdateCustomerDto newCustomer);
        void DeleteCustomerById(int id);
        void UpdateMultipleCustomerPassword(string newPw);
        CustomerDTO GetCustomerByEmail(string email);
    }
}
