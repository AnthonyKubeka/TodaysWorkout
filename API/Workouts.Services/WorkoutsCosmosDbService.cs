using Common;
using Microsoft.Azure.Cosmos;
using Workouts.Domain;

namespace Workouts.Services
{
    public class WorkoutsCosmosDbService : ICosmosDbService<Workout>
    {
        private Container _container; 

        public WorkoutsCosmosDbService(CosmosClient cosmosDbClient, string databaseName, string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }


        public async Task AddAsync(Workout workout)
        {
            try
            {
                await _container.CreateItemAsync(workout, new PartitionKey(workout.Id));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        public async Task DeleteAsync(string id)
        {
            await _container.DeleteItemAsync<Workout>(id, new PartitionKey(id)); 
        }

        public async Task<Workout> GetAsync(string id)
        {
            try
            {
                ItemResponse<Workout> response = await _container.ReadItemAsync<Workout>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<Workout>> GetMultipleAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<Workout>(new QueryDefinition(queryString));
            List<Workout> results = new List<Workout>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateAsync(string id, Workout workout)
        {
            await _container.UpsertItemAsync<Workout>(workout, new PartitionKey(id));
        }
    }
}