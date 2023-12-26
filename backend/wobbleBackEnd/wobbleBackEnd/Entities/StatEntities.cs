using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace wobbleBackEnd.Entities
{
    [BsonIgnoreExtraElements]
    public class OrderStatusSummaries
    {
        public ObjectId Id { get; set; }
        public string? year { get; set; }
        public string? month { get; set; }
        public int CANCELED { get; set; }
        public int CLOSED { get; set; }
        public int COMPLETE { get; set; }
        public int ON_HOLD { get; set; }
        public int PAYMENT_REVIEW { get; set; }
        public int PENDING { get; set; }
        public int PENDING_PAYMENT { get; set; }
        public int SUSPECTED_FRAUD { get; set; }
        public int PROCESSING { get; set; }



    }
    public class OrderCountSummaries
    {
        public ObjectId Id { get; set; }
        public string? year { get; set; }
        public string? month { get; set; }
        public int Number_of_Orders { get; set; }

    }
    public class  MonthlyTotal
    {
        public ObjectId Id { get; set; }
        public string month { get; set; }
        public double Monthly_Total { get; set; }
    }
    public class OrderCount
    {
        public ObjectId Id { get; set; }
        public string? month { get; set; }
        public string? year { get; set; }
        public int Number_of_Orders { get; set; }
    }
    public class AverageShipping
    {
        public ObjectId Id { get; set; }
        public string? year { get; set; }
        public string? month { get; set; }
        public double? Average_Days_Yearly { get; set; }
        public double? Average_Days_Monthly { get; set; }
    }
}
