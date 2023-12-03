using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceBackEnd.Entities
{
    public class Order
    {
        public ObjectId Id { get; set; }
        public int OrderId { get; set; }
        public string Type { get; set; }
        [BsonElement("Daysforshipping(real)")]
        public int DayForShippingReal { get; set; }
        [BsonElement("Daysforshipment(scheduled)")]
        public int DayForShipmentScheduled { get; set; }
        public string DeliveryStatus { get; set; }
        [BsonElement("Late_delivery_risk")]
        public int LateDeliveryRisk { get; set; }
        public string CustomerCity { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerFname { get; set; }
        public int CustomerId { get; set; }
        public string CustomerLname { get; set; }
        public string CustomerSegment { get; set; }
        public string CustomerState { get; set; }
        public string CustomerCountry { get; set; }
        public string CustomerStreet { get; set; }
        public int CustomerZipcode { get; set; }
        public string OrderStatus { get; set; }
        [BsonSerializer(typeof(CustomDateTimeSerializer))]

        [BsonElement("orderdate(DateOrders)")]
        public DateTime OrderDate { get; set; }
        [BsonSerializer(typeof(CustomDateTimeSerializer))]

        [BsonElement("shippingdate(DateOrders)")]
        public DateTime ShippingDate { get; set; }
        public string ShippingMode { get; set; }
        public double Total { get; set; }


    }
}
