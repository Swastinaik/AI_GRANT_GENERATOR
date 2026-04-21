# Postman Testing & Debugging Guide

Before starting, ensure your FastAPI application is running locally and that you have a local MongoDB instance running (or have updated your `MONGO_URI` in the `.env` file). Also be sure you have completely populated all `.env` api keys, like `PINECONE` and `GOOGLE_API_KEY`.

### 1. Start Your Server
Run this from the terminal to spin up the server:
```bash
venv/bin/uvicorn main:app --reload
```
You can monitor standard outputs and custom print statements natively in this terminal for real-time debugging!

---

### Step 1: User Registration
**Goal**: Create a new test user account in the system and save it to MongoDB.
* **Method**: `POST`
* **URL**: `http://localhost:8000/api/auth/register`
* **Body Type**: `raw` (JSON)
* **Request Body**:
```json
{
    "fullname": "Test User",
    "email": "test@example.com",
    "password": "securepassword123"
}
```

### Step 2: User Login
**Goal**: Retrieve a JWT Bearer Token that securely authorizes consecutive requests.
* **Method**: `POST`
* **URL**: `http://localhost:8000/api/auth/login`
* **Headers**: Postman auto-adds headers, but ensure `Content-Type` is set to `application/x-www-form-urlencoded`.
* **Body Type**: `x-www-form-urlencoded`
* **Request Body Keys**:
  * `username`: test@example.com
  * `password`: securepassword123
* **Action Required:** Copy the `access_token` returned from the JSON response!

---

### Understanding Postman Authorization Context
For Steps 3 and 4 below, you must pass the `access_token` you received in Step 2:
1. Navigate to the **Authorization** tab in Postman for your new request.
2. Under "Type", select **Bearer Token**.
3. Paste your generated token into the `Token` field. (This proves your mocked dependency works).

---

### Step 3: Configure Organization
**Goal**: Create your initial Organization baseline. The system will vectorize these and embed them using Pinecone!
* **Method**: `POST`
* **URL**: `http://localhost:8000/api/organization`
* **Body Type**: `raw` (JSON)
* **Request Body**:
```json
{
    "name": "Global Tech Non-Profit",
    "org_data": {
        "organization_overview": "We aim to bring technology to underserved areas.",
        "programs_and_key_activities": "Building coding bootcamps and tech hardware donations.",
        "impact_and_achievements": "Helped 10k individuals learn python.",
        "past_projects_and_funding_experience": "Funded primarily by local government grants up to $1M.",
        "team_and_leadership": "Lead by experts spanning software to operations.",
        "organizational_capacity_and_finance": "Steady 5% financial growth YoY.",
        "areas_of_operation": "Worldwide, primarily focusing on urban spaces."
    }
}
```
*Note: Make sure your Pinecone ENV variables are fully mapped! You can watch the `uvicorn` console while running to see exactly when vector DB push starts and finishes.*

### Step 4: Test Grant Generation
**Goal**: The main AI workflow – push data into LangGraph endpoints based on your RFP parsing structure.
* **Method**: `POST`
* **URL**: `http://localhost:8000/api/grant-proposal`
* **Authorization**: N/A (Based on current router structure, it takes raw standard forms, though you can protect this later)
* **Body Type**: `form-data`
* **Request Fields**:
  1. **Key**: `orgId` -> **Value**: Copy the `org.id` returned in the response payload from Step 3.
  2. **Key**: `user_input` -> **Value**: `{"mission_focus": "Tech inclusion", "grant_size": "500000"}`
  3. **Key**: `rfp` -> **Value**: Switch the type from "Text" to "File", and select a sample RFP `.pdf` from your system!

---

## 🐞 Best Practices For Debugging

1. **Leverage the Uvicorn Console**: 
   Since you've run the server with `--reload`, adding standard `print("DEBUG VALUE:: ", my_data)` or `logging.info(...)` directly into route files (`api/grant_routes.py` or your nodes like `orgdata_fetch_node.py`) will stream instantly into your terminal.
2. **Handle Postman "500 Internal Server Errors"**:
   A generic error means your codebase crashed natively! **Always check your terminal that is running the FastAPI app** to see the full Python Traceback. It will pinpoint the exact line, like failed MongoDB connections or expired LLM tokens.
3. **Double Check Beanie / Pinecone Loading**:
   If Pinecone complains during org creation, use `print(...)` in `services/vector_store.py` before `update_vector_data()`. If MongoDB acts weird, ensure `mongod` is actually actively running locally!
4. **Isolate AI Calls**: 
   In `graph.ainvoke(initial_state)` if it stalls, check the terminal. The Google Gemini or LangChain agents are network requests - they may timeout or reject payloads. Validate tokens are set properly!
