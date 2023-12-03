using MongoDB.Bson;

namespace ECommerceBackEnd.Entities
{
    public class Customer
    {
        public ObjectId Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerCountry { get; set; }
        public string CustomerSegment { get; set; }
        public string CustomerStreet { get; set; }
        public string CustomerState { get; set; }
        public int CustomerZipcode { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPassword { get; set; }
        public string CustomerFname { get; set; }
        public string CustomerLname { get; set; }

    }
}
