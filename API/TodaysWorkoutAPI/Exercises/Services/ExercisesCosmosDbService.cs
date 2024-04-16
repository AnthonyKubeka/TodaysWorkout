using Microsoft.Azure.Cosmos;
using Newtonsoft.Json.Linq;
using TodaysWorkoutAPI.Common.Services;
using TodaysWorkoutAPI.Exercises.Domain;

namespace TodaysWorkoutAPI.Exercises.Services
{
    public class ExercisesCosmosDbService : CosmosDbService<Exercise>
    {
        private Container _container; 

        public ExercisesCosmosDbService(CosmosClient cosmosDbClient, string databaseName, string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }

        public override async Task AddAsync(Exercise exercise)
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

        public override async Task AddGenericDataAsync(string genericDataName)
        {
            string documentId = "exercise-data";
            try
            {
                ItemResponse<dynamic> response = await _container.ReadItemAsync<dynamic>(documentId, new PartitionKey(documentId));
                var document = response.Resource;
                List<dynamic> exercises = new List<dynamic>(document.exerciseStaticDetails);
                var maxId = exercises.Max(d => (int)d.id);

                JObject newExercise = new JObject
                {
                    ["id"] = maxId + 1,
                    ["name"] = genericDataName
                };

                exercises.Add(newExercise);
                JArray updatedExercises = JArray.FromObject(exercises);
                document.exerciseStaticDetails = updatedExercises; 
                await _container.ReplaceItemAsync(document, documentId, new PartitionKey(documentId));
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                System.Console.WriteLine("Document not found.");
            }
        }

        public override async Task DeleteAsync(string id)
        {
            await _container.DeleteItemAsync<Exercise>(id, new PartitionKey(id)); 
        }

        public override async Task<Exercise> GetAsync(string id)
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

        public override async Task<IEnumerable<Exercise>> GetMultipleAsync(string queryString)
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

        public override async Task<IEnumerable<Dictionary<string, object>>> GetGenericData()
        {
            string queryString = "SELECT c.exerciseStaticDetails FROM c WHERE c.id = 'exercise-data'";
            var query = _container.GetItemQueryIterator<dynamic>(new QueryDefinition(queryString));

            List<Dictionary<string, object>> results = new List<Dictionary<string, object>>();

            if (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                foreach (var item in response)
                {
                    if (item.exerciseStaticDetails != null)
                    {
                        foreach (var detail in item.exerciseStaticDetails)
                        {
                            var exerciseDetail = detail.ToObject<Dictionary<string, object>>();
                            results.Add(exerciseDetail);
                        }
                    }
                }
            }

            return results;
        }

        public override async Task UpdateAsync(string id, Exercise exercise)
        {
            await _container.UpsertItemAsync<Exercise>(exercise, new PartitionKey(id));
        }
    }
}