using wobbleBackEnd.Entities;

namespace wobbleBackEnd.Contracts
{
    public interface IStaffRepository
    {
        void CreateStaff(Staff staff);
        void DeleteStaff(Staff staff);
        Staff GetStaff(int id);
        IEnumerable<Staff> GetStaves();
        void UpdateStaff(Staff staff);
        Staff GetStaffByEmail(string email);
    }
}