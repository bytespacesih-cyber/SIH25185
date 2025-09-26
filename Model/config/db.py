import os
import sys
from pymongo import MongoClient
import dotenv
dotenv.load_dotenv()
def connect_db():
    try:
        mongo_uri = os.getenv("MONGODB_URI")
        client = MongoClient(mongo_uri)
        # Test the connection
        client.admin.command('ping')
        print(f"MongoDB Connected: {client.address[0]}:{client.address[1]}")
        return client
    except Exception as error:
        print(f"Database connection error: {error}")
        sys.exit(1)

# Example usage
if __name__ == "__main__":
    db_client = connect_db()
