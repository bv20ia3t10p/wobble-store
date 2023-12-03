using ECommerceBackEnd.Entities;

namespace ECommerceBackEnd.Contracts
{
    public interface ICustomerRepository
    {
        IEnumerable<Customer> GetCustomers();
        Customer GetCustomerById(int id);
        void CreateCustomer(Customer customer);
        void UpdateCustomer(Customer customer);
        void DeleteCustomer(Customer customer);
        int GetLatestId();
        void UpdateMultipleCustomerPassword(string newPw);
        //Login(string email, string passwword);
        Customer GetCustomerByEmail(string email);
    }
}
