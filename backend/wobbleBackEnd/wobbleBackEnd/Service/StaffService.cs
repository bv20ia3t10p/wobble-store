using AutoMapper;
using ECommerceBackEnd.Contracts;
using wobbleBackEnd.Dtos;
using wobbleBackEnd.Entities;
using wobbleBackEnd.Service.Contracts;

namespace wobbleBackEnd.Service
{
    public class StaffService : IStaffService
    {
        private IRepositoryManager _repository;
        private IMapper _mapper;
        public StaffService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repository = repositoryManager;
            _mapper = mapper;
        }
        public Staff GetStaffById(int id) => _repository.Staff.GetStaff(id);
        public IEnumerable<Staff> GetStaves() => _repository.Staff.GetStaves();
        public Staff GetStaffByEmail(string email) => _repository.Staff.GetStaffByEmail(email);
        public Staff CreateStaff(CreateStaffDto newStaff)
        {
            var accountInDb = (newStaff.CustomerId != null ?
                _repository.Customer.GetCustomerById((int)newStaff.CustomerId) :
                newStaff.CustomerEmail != null ?
                    _repository.Customer.GetCustomerByEmail(newStaff.CustomerEmail) :
                    null)
                        ?? throw new Exception("Account not found in DB");
            var newStaffEntity = _mapper.Map<Staff>(newStaff);
            newStaffEntity.CustomerId = accountInDb.CustomerId;
            newStaffEntity.CustomerEmail = accountInDb.CustomerEmail;
            _repository.Staff.CreateStaff(newStaffEntity);
            return _repository.Staff.GetStaffByEmail(newStaffEntity.CustomerEmail);
        }
        public Staff UpdateStaff(UpdateStaffDto newStaff)
        {
            var staffInDb = _repository.Staff.GetStaffByEmail(newStaff.CustomerEmail) ?? throw new Exception("Staff not found");
            _mapper.Map(newStaff, staffInDb);
            _repository.Staff.UpdateStaff(staffInDb);
            return staffInDb;
        }
        public void DeleteStaff(int id)
        {
            var staffInDb = _repository.Staff.GetStaff(id) ?? throw new Exception("Staff not found");
            _repository.Staff.DeleteStaff(staffInDb);
        }
    }
}
