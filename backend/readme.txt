Follow these steps:
1. Ensure that docker is configured for Linux ( Google this step)
2. Ensure that data is generated through data_tasks/data_preprocessing.py
3. Create and pull a mongodb image
3.1. (cmd) docker pull mongo
3.2. (cmd) docker run -p 27018:27017 --name ie104db mongo
3.3. On MongoDB Compass, connect to mongodb://localhost:27018, create "ie104" database and "products" as the first collection
3.4. Create collections: "customers", "payments", "order_details", "orders", "categories", "departments"
3.5. Import respective .csv in /data to their respective collections, with "CustomerState" columns in "customers", "orders" being String format, others are in default
4. In backend\ECommerceBackEnd\ECommerceBackEnd\appsettings.json change the "Host" property of "MongoDbSettings" object to your machine ipv4 network in the localhost (Get this from running "ipconfig" in the cmd)
Should look something like this
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "MongoDbSettings": {
    "Host": "192.168.0.105",
    "Port": "27018"
  }
}

5. (cmd) docker build -f "<Path to Dockerfile (e.g. D:\Code\IE104-retailer-web-project\backend\ECommerceBackEnd\ECommerceBackEnd\Dockerfile)>" -t ie104api "<Path to solution (e.g. D:\Code\IE104-retailer-web-project\backend\ECommerceBackEnd)>"
6. (cmd) docker run -p 1777:80 ie104api ie104api
7. Send api requests to localhost:1777