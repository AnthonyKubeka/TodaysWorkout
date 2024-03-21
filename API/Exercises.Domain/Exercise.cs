using Newtonsoft.Json;

namespace Exercises.Domain
{
    public class Exercise
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "exerciseStaticDetail")]
        public ExerciseStaticDetail ExerciseStaticDetail  { get; set; }
        [JsonProperty(PropertyName = "sets")]
        public int Sets { get; set; }
        [JsonProperty(PropertyName = "reps")]
        public int Reps { get; set; }
    }
}