using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using wobbleBackEnd.Entities;

namespace ECommerceBackEnd.Repositories
{
    public class DepartmentRepository : RepositoryBase<Department>, IDepartmentRepository
    {
        public DepartmentRepository(IMongoDatabase database, string collectionName)
        : base(database, collectionName)
        {
        }
        public int GetLatestId()
        {
            int latestId = GetAll().OrderByDescending(c => c.DepartmentId).FirstOrDefault().DepartmentId + 1;
            return latestId;
        }
        public void CreateDepartment(Department newDepartment)
        {
            Create(newDepartment);
        }
        public void DeleteDepartmentById(int cid) => Delete(c => c.DepartmentId == cid);

        public Department GetDepartmentById(int CID) => GetByCondition(c => c.DepartmentId == CID);

        public IEnumerable<Department> GetDepartments() => GetAll();

        public void UpdateDepartment(Department department) => Update(c => c.DepartmentId == department.DepartmentId, department);
    }
}
