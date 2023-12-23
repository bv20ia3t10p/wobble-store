using Catalog.Settings;
using ECommerceBackEnd;
using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Repositories;
using Microsoft.AspNetCore.OData;
using Microsoft.Extensions.Configuration;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("policy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
static IEdmModel GetEdmModel()
{
    ODataConventionModelBuilder builder = new();
    builder.EntitySet<ProductDto>("Products");
    builder.EntitySet<OrderDto>("Orders");
    builder.EntitySet<CustomerDTO>("Customers");
    builder.EntitySet<OrderDetailDto>("OrderDetail");
    return builder.GetEdmModel();
}
// Add services to the container.
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();
builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.AddControllers(options => { options.AllowEmptyInputInBodyModelBinding = true; }).AddOData(options => options
        .AddRouteComponents("odata", GetEdmModel())
        .Select()
        .Filter()
        .OrderBy()
        .SetMaxTop(20)
        .Count()
        .Expand()
    );
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

IConfiguration configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .AddEnvironmentVariables()
    .Build();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
//{
//    var settings = configuration.GetSection(nameof(MongoDbSettings)).Get<MongoDbSettings>();
//    return new MongoClient(settings.ConnectionString);
//});

builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var settings = configuration.GetSection("MongoDbCloud")["ConnectionString"];
    return new MongoClient(settings);
});


var app = builder.Build();
app.UseCors("policy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
IWebHostEnvironment environment = app.Environment;
app.UseOptions();

app.UseHttpsRedirection();
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
