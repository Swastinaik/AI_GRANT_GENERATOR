from app.db.client import client

async def get_user(email: str):
    database = client.user_database
    user = await database.users.find_one({"email": email})
    if user:
        user["_id"] = str(user["_id"])
        return user
    else:
        return None
