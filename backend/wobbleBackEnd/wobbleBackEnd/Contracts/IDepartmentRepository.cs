using ECommerceBackEnd.Entities;
using wobbleBackEnd.Entities;

namespace ECommerceBackEnd.Contracts
{
    public interface IDepartmentRepository
    {
        int GetLatestId();
        void CreateDepartment(Department newDepartment);
        void DeleteDepartmentById(int CID);
        IEnumerable<Department> GetDepartments();
        Department GetDepartmentById(int CID);
        void UpdateDepartment(Department department);
    }
}