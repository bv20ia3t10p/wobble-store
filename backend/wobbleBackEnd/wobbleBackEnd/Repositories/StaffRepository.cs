using ECommerceBackEnd.Repositories;
using MongoDB.Driver;
using wobbleBackEnd.Contracts;
using wobbleBackEnd.Entities;

namespace wobbleBackEnd.Repositories
{
    public class StaffRepository : RepositoryBase<Staff>, IStaffRepository
    {
        public StaffRepository(IMongoDatabase database, string collectionName) : base(database, collectionName) { }
        public Staff GetStaff(int id) => GetByCondition(staff => staff.CustomerId == id);
        public IEnumerable<Staff> GetStaves() => GetAll().ToList();
        public void CreateStaff(Staff staff) => Create(staff);
        public void DeleteStaff(Staff staff) => Delete(staffInDb => staffInDb.CustomerId == staff.CustomerId);
        public void UpdateStaff(Staff staff) => Update(staffInDb => staffInDb.CustomerId == staff.CustomerId, staff);
        public Staff GetStaffByEmail(string email) => GetByCondition(staff=>staff.CustomerEmail == email);

    }
}
