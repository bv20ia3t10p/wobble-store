using wobbleBackEnd.Dtos;
using wobbleBackEnd.Entities;

namespace wobbleBackEnd.Service.Contracts
{
    public interface IStaffService
    {
        Staff CreateStaff(CreateStaffDto newStaff);
        void DeleteStaff(int id);
        Staff GetStaffByEmail(string email);
        Staff GetStaffById(int id);
        IEnumerable<Staff> GetStaves();
        Staff UpdateStaff(UpdateStaffDto newStaff);
    }
}