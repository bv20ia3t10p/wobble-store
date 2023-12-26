using AutoMapper;
using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Service.Contracts;
using wobbleBackEnd.Entities;

namespace ECommerceBackEnd.Service
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IMapper _mapper;
        private readonly IRepositoryManager _repository;
        public DepartmentService(IMapper mapper, IRepositoryManager repository)
        {
            _mapper = mapper;
            _repository = repository;
        }
        public DepartmentDto CreateDepartment(CreateDepartmentDto createDepartmentDto)
        {
            var departmentEntity = _mapper.Map<Department>(createDepartmentDto);
            departmentEntity.DepartmentId = _repository.Department.GetLatestId();
            _repository.Department.CreateDepartment(departmentEntity);
            return _mapper.Map<DepartmentDto>(departmentEntity);
        }
        public IEnumerable<DepartmentDto> GetDepartments()
            => _mapper.Map<IEnumerable<DepartmentDto>>
            (_repository.Department.GetDepartments());
        public void DeleteDepartmentById(int id) =>
            _repository.Department.DeleteDepartmentById(id);
        public DepartmentDto GetDepartmentById(int id) =>
            _mapper.Map<DepartmentDto>(_repository.Department.GetDepartmentById(id));
        public DepartmentDto UpdateDepartment(UpdateDepartmentDto departmentDto)
        {
            var departmentInDb = _repository.Department.GetDepartmentById((int)departmentDto.DepartmentId) ?? throw new Exception("Department not found");
            if (departmentInDb != null)
            {
                throw new Exception("Department not found");
            }
            _mapper.Map(departmentDto, departmentInDb);
            _repository.Department.UpdateDepartment(departmentInDb);
            return _mapper.Map<DepartmentDto>(departmentInDb);
        }
    }
}
