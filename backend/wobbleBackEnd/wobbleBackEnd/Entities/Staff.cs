using MongoDB.Bson;

namespace wobbleBackEnd.Entities
{
    public class Staff
    {
        public ObjectId Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerEmail { get; set; }
        public string Role { get; set; }
    }
}
