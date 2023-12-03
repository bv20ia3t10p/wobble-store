using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Entities;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ECommerceBackEnd.Repositories
{
    public class CustomerRepository : RepositoryBase<Customer>, ICustomerRepository
    {

        public CustomerRepository(IMongoDatabase database, string collectionName) : base(database, collectionName)
        {
        }
        public int GetLatestId() => GetAll().ToList().OrderByDescending(c => c.CustomerId).FirstOrDefault().CustomerId + 1;

        public void CreateCustomer(Customer customer) => Create(customer);

        public void DeleteCustomer(Customer customer) => Delete(c => c.CustomerId == customer.CustomerId);

        public IEnumerable<Customer> GetCustomers() => GetAll().ToList();
        public Customer GetCustomerById(int id) => GetByCondition(c => c.CustomerId == id);

        public void UpdateCustomer(Customer customer) => Update(c => c.CustomerId == customer.CustomerId, customer);
        public void UpdateMultipleCustomerPassword(string newPw) => UpdateMany("CustomerPassword", c => c.CustomerPassword == "XXXXXXXXX", newPw);
        public Customer GetCustomerByEmail(string email) => GetByCondition(c => c.CustomerEmail == email);
    }
}
