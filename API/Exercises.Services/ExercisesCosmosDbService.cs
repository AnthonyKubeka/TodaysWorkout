using Common;
using Exercises.Domain;
using Microsoft.Azure.Cosmos;

namespace Exercises.Services
{
    public class ExercisesCosmosDbService : ICosmosDbService<Exercise>
    {
        private Container _container; 

        public ExercisesCosmosDbService(CosmosClient cosmosDbClient, string databaseName, string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddAsync(Exercise exercise)
        {
            try
            {
                await _container.CreateItemAsync(exercise, new PartitionKey(exercise.Id));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            
            
        }

        public async Task DeleteAsync(string id)
        {
            await _container.DeleteItemAsync<Exercise>(id, new PartitionKey(id)); 
        }

        public async Task<Exercise> GetAsync(string id)
        {
            try
            {
                ItemResponse<Exercise> response = await _container.ReadItemAsync<Exercise>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<Exercise>> GetMultipleAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<Exercise>(new QueryDefinition(queryString));
            List<Exercise> results = new List<Exercise>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task UpdateAsync(string id, Exercise exercise)
        {
            await _container.UpsertItemAsync<Exercise>(exercise, new PartitionKey(id));
        }
    }
}