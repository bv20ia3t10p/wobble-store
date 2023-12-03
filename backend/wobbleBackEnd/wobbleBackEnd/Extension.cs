using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Repositories;
using ECommerceBackEnd.Service.Contracts;
using ECommerceBackEnd.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MongoDB.Bson.Serialization;

namespace ECommerceBackEnd
{
    public static class Extension
    {

        public static void ConfigureCors(this IServiceCollection services) => services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builders =>
                builders.AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin());
            });
        public static void ConfigureIISIntegration(this IServiceCollection services) => services.Configure<IISOptions>(options =>
        {

        });
        public static void ConfigureRepositoryManager(this IServiceCollection services) => services.AddScoped<IRepositoryManager, RepositoryManager>();
        public static void ConfigureServiceManager(this IServiceCollection services) => services.AddScoped<IServiceManager, ServiceManager>();
        public static void ConfigureJWT(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings");
            //var secretKey = Environment.GetEnvironmentVariable("SECRET");
            var secretKey = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings["validIssuer"],
                        ValidAudience = jwtSettings["validAudience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                    };
                });
        }
    }
    public class CustomDateTimeSerializer : IBsonSerializer
    {
        public Type ValueType => typeof(DateTime);

        public object Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
        {
            var str = context.Reader.ReadString();
            return DateTime.ParseExact(str, "M/d/yyyy H:m", System.Globalization.CultureInfo.InvariantCulture);
        }

        public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
        {
            DateTime dateTime = (DateTime)value;
            context.Writer.WriteString(dateTime.ToString("M/d/yyyy H:m"));
        }
    }
    public class OptionsMiddleware
    {
        private readonly RequestDelegate _next;

        public OptionsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext context)
        {
            return BeginInvoke(context);
        }

        private Task BeginInvoke(HttpContext context)
        {
            if (context.Request.Method == "OPTIONS")
            {
                context.Response.Headers.Add("Access-Control-Allow-Origin", new[] { (string)context.Request.Headers["Origin"] });
                context.Response.Headers.Add("Access-Control-Allow-Headers", new[] { "Origin, X-Requested-With, Content-Type, Accept" });
                context.Response.Headers.Add("Access-Control-Allow-Methods", new[] { "GET, POST, PUT, DELETE, OPTIONS" });
                context.Response.Headers.Add("Access-Control-Allow-Credentials", new[] { "true" });
                context.Response.StatusCode = 200;
                return context.Response.WriteAsync("OK");
            }

            return _next.Invoke(context);
        }
    }

    public static class OptionsMiddlewareExtensions
    {
        public static IApplicationBuilder UseOptions(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<OptionsMiddleware>();
        }
    }

}
