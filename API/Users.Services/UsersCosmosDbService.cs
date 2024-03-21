using Common;
using Microsoft.Azure.Cosmos;
using User = Users.Domain.User;

namespace Users.Services
{
    public class UsersCosmosDbService : ICosmosDbService<User>
    {
        private Container _container; 

        public UsersCosmosDbService(CosmosClient cosmosDbClient, string databaseName, string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }


        public async Task AddAsync(User user)
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

        public async Task DeleteAsync(string id)
        {
            await _container.DeleteItemAsync<Domain.User>(id, new PartitionKey(id)); 
        }

        public async Task<User> GetAsync(string id)
        {
            try
            {
                ItemResponse<User> response = await this._container.ReadItemAsync<User>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<User>> GetMultipleAsync(string queryString)
        {
            var query = this._container.GetItemQueryIterator<User>(new QueryDefinition(queryString));
            List<User> results = new List<User>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateAsync(string id, User user)
        {
            await this._container.UpsertItemAsync<User>(user, new PartitionKey(id));
        }
    }
}