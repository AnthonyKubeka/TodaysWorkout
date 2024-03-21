using Newtonsoft.Json; 

namespace Users.Domain
{
    public class User
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "userName")]
        public string UserName { get; set; }
    }
}