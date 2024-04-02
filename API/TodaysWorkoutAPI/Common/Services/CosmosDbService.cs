namespace TodaysWorkoutAPI.Common.Services
{
    public abstract class CosmosDbService<T>
    {
        public abstract Task<IEnumerable<T>> GetMultipleAsync(string query);
        public abstract Task<T> GetAsync(string id);
        public abstract Task AddAsync(T item);
        public abstract Task UpdateAsync(string id, T item);
        public abstract Task DeleteAsync(string id); 
        public abstract Task<IEnumerable<Dictionary<string, object>>> GetGenericData(); 
    }
}
