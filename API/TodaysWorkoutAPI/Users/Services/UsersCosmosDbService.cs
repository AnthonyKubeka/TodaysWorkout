using Microsoft.Azure.Cosmos;
using User = TodaysWorkoutAPI.Users.Domain.User;
using TodaysWorkoutAPI.Common.Services; 

namespace TodaysWorkoutAPI.Users.Services
{
    public class UsersCosmosDbService : CosmosDbService<User>
    {
        private Container _container; 

        public UsersCosmosDbService(CosmosClient cosmosDbClient, string databaseName, string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }


        public override async Task AddAsync(User user)
        {
            try
            {
                await _container.CreateItemAsync(user, new PartitionKey(user.Id));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            
            
        }

        public override async Task DeleteAsync(string id)
        {
            await _container.DeleteItemAsync<User>(id, new PartitionKey(id)); 
        }

        public override async Task<User> GetAsync(string id)
        {
            try
            {
                ItemResponse<User> response = await _container.ReadItemAsync<User>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public override Task<IEnumerable<Dictionary<string, object>>> GetGenericData()
        {
            throw new NotImplementedException();
        }

        public override async Task<IEnumerable<User>> GetMultipleAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<User>(new QueryDefinition(queryString));
            List<User> results = new List<User>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public override async Task UpdateAsync(string id, User user)
        {
            await _container.UpsertItemAsync<User>(user, new PartitionKey(id));
        }
    }
}