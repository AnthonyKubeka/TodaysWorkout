using Microsoft.Azure.Cosmos;
using TodaysWorkoutAPI.Common.Services;
using TodaysWorkoutAPI.Users.Services;
using TodaysWorkoutAPI.Exercises.Domain;
using TodaysWorkoutAPI.Exercises.Services;
using TodaysWorkoutAPI.Workouts.Domain;
using TodaysWorkoutAPI.Workouts.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (builder.Environment.IsDevelopment())
{ //use local SecretManager
    string url = builder.Configuration["TWURL"];
    string primaryKey = builder.Configuration["TWPrimaryKey"];
    string dbName = builder.Configuration["TWDatabaseName"];

    builder.Services.AddSingleton<ICosmosDbService<TodaysWorkoutAPI.Users.Domain.User>>(options =>
    {
        var cosmosClient = new CosmosClient(url, primaryKey);
        return new UsersCosmosDbService(cosmosClient, dbName, "Users");
    });

    builder.Services.AddSingleton<ICosmosDbService<Exercise>>(options =>
    {
        var cosmosClient = new CosmosClient(url, primaryKey);
        return new ExercisesCosmosDbService(cosmosClient, dbName, "Exercises");
    });

    builder.Services.AddSingleton<ICosmosDbService<Workout>>(options =>
    {
        var cosmosClient = new CosmosClient(url, primaryKey);
        return new WorkoutsCosmosDbService(cosmosClient, dbName, "Workouts");
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
