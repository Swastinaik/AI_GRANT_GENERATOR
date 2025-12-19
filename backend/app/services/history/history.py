from app.db.client import db
from datetime import datetime
from app.models.history import History

async def create_user_history(user_id: str,
                        agent_name: str,
                        description: str| None):
    try:
        time = datetime.now()
        doc = {
            "user_id": user_id,
            "agent_name": agent_name,
            "description": description,
            "time":time ,
        }
        history = History(**doc)
        res = await db.history.insert_one(history.model_dump())
        return str(res.inserted_id)
    except Exception as e:
        print(f"Failed to create history: {e}")
        raise Exception

async def get_user_history(
        user_id: str,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "time",
        sort_order: int = -1
):
    try:
        documents = []
        cursor = await db.history.find({"user_id": user_id})
        cursor = cursor.sort(sort_by, sort_order).skip(skip).limit(limit)
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            documents.append(doc)
        return documents
    except Exception as e:
        print(f"Failed to get history: {e}")
        raise Exception


