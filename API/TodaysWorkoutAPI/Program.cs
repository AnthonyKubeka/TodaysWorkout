using Common;
using Microsoft.Azure.Cosmos;
using Users.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (builder.Environment.IsDevelopment())
{ //use local SecretManager
    builder.Services.AddSingleton<ICosmosDbService<Users.Domain.User>>(options =>
    {
        string url = builder.Configuration["TWURL"];
        string primaryKey = builder.Configuration["TWPrimaryKey"];
        string dbName = builder.Configuration["TWDatabaseName"];
        string containerName = "Users"; 
        var cosmosClient = new CosmosClient(url, primaryKey);

        return new UsersCosmosDbService(cosmosClient, dbName, containerName);
    });
}


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
