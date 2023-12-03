using MongoDB.Bson;

namespace ECommerceBackEnd.Entities
{
    public class Category
    {
       public ObjectId Id { get; set; }
       public int CategoryId { get; set; }
       public string CategoryName { get; set; }
    }
}
