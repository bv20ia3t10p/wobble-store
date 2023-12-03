using System.Security.Policy;

namespace Catalog.Settings
{
    public class MongoDbSettings
    {
        public string Host { get;set; }
        public int Port { get; set; }
        public string ConnectionString { 
            get 
            {
                return $"mongodb://{Host}:{Port}";
            }
                }
    }
}
