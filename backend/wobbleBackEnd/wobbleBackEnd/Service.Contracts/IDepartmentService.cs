using ECommerceBackEnd.Dtos;

namespace ECommerceBackEnd.Service.Contracts
{
    public interface IDepartmentService
    {
        public DepartmentDto CreateDepartment(CreateDepartmentDto createDepartmentDto);
        void DeleteDepartmentById(int id);
        DepartmentDto GetDepartmentById(int id);
        IEnumerable<DepartmentDto> GetDepartments();
        DepartmentDto UpdateDepartment(UpdateDepartmentDto departmentDto);
    }
}
