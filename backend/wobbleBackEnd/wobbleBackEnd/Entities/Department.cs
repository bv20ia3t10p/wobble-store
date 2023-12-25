using MongoDB.Bson;

namespace wobbleBackEnd.Entities
{
    public class Department
    {
        public ObjectId Id { get; set; }
        public string DepartmentName { get; set; }
        public int DepartmentId { get; set; }
    }
}
