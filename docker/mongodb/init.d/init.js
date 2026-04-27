db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

var shouldValidateCollection = process.env.MONGO_SHOULD_VALIDATE_COLLECTIONS === "true";

var COLLECTION_EVENTS = "events";
var COLLECTION_BOOKINGS = "bookings";
var COLLECTION_IDEMPOTENCIES = "idempotencies";

var eventsCollectionOptions = shouldValidateCollection
  ? {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          title: "Event object validation",
          required: [ "title", "date", "capacity" ],
          properties: {
            title: {
              bsonType: "string",
              description: "`title` field is mandatory and it must be a string."
            },
            description: {
              bsonType: "string",
              description: "`description` field must be a string."
            },
            date: {
              bsonType: "date",
              description: "`date` field must be a string."
            },
            capacity: {
              bsonType: "int",
              minimum: 1,
              description: "`capacity` field is mandatory, must be an integer and it must be greater than 0."
            }
          }
        }
      }
    }
  : {}
;

db.createCollection(COLLECTION_EVENTS, eventsCollectionOptions);
db.getCollection(COLLECTION_EVENTS).createIndex({ title: 1 });
db.getCollection(COLLECTION_EVENTS).createIndex({ date: 1 });

var bookingsCollectionOptions = shouldValidateCollection
  ? {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "Booking object validation",
        required: [ "title", "date", "capacity" ],
        properties: {
          eventId: {
            bsonType: "objectId",
            description: "`eventId` field is mandatory and it must be a valid ObjectId object."
          },
          customerName: {
            bsonType: "string",
            description: "`customerName` field is mandatory and must be a string."
          },
          customerEmail: {
            bsonType: "string",
            description: "`customerEmail` field is mandatory and must be a string."
          },
          quantity: {
            bsonType: "int",
            minimum: 1,
            description: "`quantity` field is mandatory, must be an integer and it must be greater than 0."
          },
          status: {
            enum: [ "pending", "confirmed", "cancelled" ],
            description: "`status` field is mandatory"
          },
        }
      }
    }
  }
  : {}
;

db.createCollection(COLLECTION_BOOKINGS, bookingsCollectionOptions);
db.getCollection(COLLECTION_BOOKINGS).createIndex({ eventId: 1 });
db.getCollection(COLLECTION_BOOKINGS).createIndex({ customerEmail: 1 });
db.getCollection(COLLECTION_BOOKINGS).createIndex({ status: 1 });

var idempotenciesCollectionOptions = shouldValidateCollection
  ? {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "Idempotency object validation",
        required: [ "key", "response", "statusCode" ],
        properties: {
          key: {
            bsonType: "string",
            description: "`key` field is mandatory and it must be a string."
          },
          response: {
            bsonType: "object",
            description: "`response` field is mandatory and it must be a JSON object."
          },
          statusCode: {
            bsonType: "int",
            minimum: 100,
            maximum: 599,
            description: "statusCode"
          },
          createdAt: {
            bsonType: "date",
            description: "`createdAt` field must be a valid Date object."
          }
        }
      }
    }
  }
  : {}
;

db.createCollection(COLLECTION_IDEMPOTENCIES, idempotenciesCollectionOptions);
