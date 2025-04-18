﻿using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ProductService.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } 

        [BsonElement("Name")]
        public string Name { get; set; }

        [BsonElement("Description")]
        public string Description { get; set; }

        [BsonElement("Price")]
        public decimal Price { get; set; }

        [BsonElement("Image")]
        public string Image { get; set; }
    }
}
