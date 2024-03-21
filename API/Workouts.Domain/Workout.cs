using Exercises.Domain;
using Newtonsoft.Json;

namespace Workouts.Domain
{
    public class Workout
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "exercises")]
        public List<Exercise> Exercises { get; set; }
    }
}