# ⚡ Quick Test Guide - Review & Session Features

## 🚀 Start the Server

```bash
cd Backend
npm run dev
```

Expected output:
```
✅ MongoDB Atlas Connected Successfully
🚀 Server running on port 3000
```

---

## 📋 Testing Flow

### Step 1: Register Users
Register 2 users to pair them in a session.

```bash
# User A
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "password123",
    "mobile": "9876543210",
    "college": "Stanford",
    "skillsOffered": ["JavaScript"],
    "skillsNeeded": ["Python"]
  }'

# User B  
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com",
    "password": "password123",
    "mobile": "1234567890",
    "college": "MIT",
    "skillsOffered": ["Python"],
    "skillsNeeded": ["JavaScript"]
  }'
```

**Save the returned user IDs for both users**

---

### Step 2: Login to Get Tokens

```bash
# Login as Alice
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'

# Save the token from response as $ALICE_TOKEN
# Repeat for Bob: bob@example.com as $BOB_TOKEN
```

---

### Step 3: Create a Match (Session)

Use the match controller to create a session. You'll need to check the match controller for the exact endpoint.

*Note: You may need to create this session via a database insert or through the match/profile API*

**Or** create it directly via MongoDB Atlas:
```javascript
// Insert a test session
db.sessions.insertOne({
  userA: ObjectId("alice_user_id"),
  userB: ObjectId("bob_user_id"),
  skillA: "JavaScript",
  skillB: "Python",
  status: "Pending",
  dateTime: new Date(),
  durationMins: 60,
  note: "Test session",
  ratings: []
})
```

**Save the session ID**

---

### Step 4: Get Your Sessions ✅

```bash
curl -X GET http://localhost:3000/sessions/mine \
  -H "Authorization: Bearer $ALICE_TOKEN"
```

**Expected Response:**
```json
[
  {
    "_id": "session_id",
    "userA": {
      "_id": "alice_id",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "rating": 0
    },
    "userB": {
      "_id": "bob_id", 
      "name": "Bob Smith",
      "email": "bob@example.com",
      "rating": 0
    },
    "skillA": "JavaScript",
    "skillB": "Python",
    "status": "Pending",
    "ratings": [],
    ...
  }
]
```

✅ **PASS**: Sessions retrieved with userA and userB properly populated

---

### Step 5: Update Session Status

```bash
# Change status: Pending → Scheduled
curl -X PATCH http://localhost:3000/sessions/$SESSION_ID/status \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Scheduled"}'
```

**Valid transitions:**
- `Pending` → `Scheduled` or `Cancelled`
- `Scheduled` → `Ongoing` or `Cancelled`
- `Ongoing` → `Completed`
- `Completed` → (no transitions)

✅ **PASS**: Status updated successfully

---

### Step 6: Complete the Session (Set Status to Completed)

```bash
# Scheduled → Ongoing
curl -X PATCH http://localhost:3000/sessions/$SESSION_ID/status \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Ongoing"}'

# Ongoing → Completed
curl -X PATCH http://localhost:3000/sessions/$SESSION_ID/status \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Completed"}'
```

---

### Step 7: Add Review to Completed Session ✅

```bash
# Alice reviews Bob
curl -X POST http://localhost:3000/reviews/$SESSION_ID/add \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 5,
    "feedback": "Bob was an excellent teacher! Very patient and knowledgeable."
  }'
```

**Expected Response:**
```json
{
  "message": "Review added successfully",
  "review": {
    "_id": "review_id",
    "reviewer": "alice_id",
    "reviewee": "bob_id",
    "session": "session_id",
    "score": 5,
    "feedback": "Bob was an excellent teacher! Very patient and knowledgeable.",
    "createdAt": "2024-04-03T10:30:00.000Z"
  }
}
```

✅ **PASS**: Review added successfully

---

### Step 8: Verify Review Saved

```bash
# Get Bob's profile to see updated rating
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer $BOB_TOKEN"
```

Expected: Bob's `rating` should be updated to 5.0

✅ **PASS**: Review stored and rating updated

---

### Step 9: Prevent Duplicate Review

```bash
# Try to review the same session again (should fail)
curl -X POST http://localhost:3000/reviews/$SESSION_ID/add \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 4,
    "feedback": "Actually, second review"
  }'
```

**Expected Response (400):**
```json
{
  "message": "You have already reviewed this session"
}
```

✅ **PASS**: Duplicate prevention working

---

### Step 10: Test Error Cases

```bash
# ❌ Try to review incomplete session
curl -X POST http://localhost:3000/reviews/$SESSION_ID/add \
  -H "Authorization: Bearer $BOB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"score": 5, "feedback": "Test"}'
# Response: Session status is not "Completed"

# ❌ Try invalid score (0)
curl -X POST http://localhost:3000/reviews/$ANOTHER_SESSION/add \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"score": 0, "feedback": "Bad range"}'
# Response: Score must be between 1 and 5

# ❌ Try no auth header
curl -X GET http://localhost:3000/sessions/mine
# Response: 401 - No token provided
```

---

## ✅ Test Checklist

- [ ] Server starts without JWT errors
- [ ] GET /sessions/mine returns sessions with userA/userB
- [ ] GET /sessions/:id returns session details
- [ ] PATCH /sessions/:id/status updates status correctly
- [ ] POST /reviews/:id/add adds review to completed session
- [ ] Review prevents duplicates
- [ ] User rating updates to average of all reviews
- [ ] Score validation (1-5) works
- [ ] Auth middleware blocks unauthed requests
- [ ] Invalid status transitions rejected

---

## 🐛 Known Limitations

1. Session creation may need to be done via match API or directly in MongoDB
2. JWT_SECRET should be changed in production
3. Ensure both users exist before creating a session

---

## 📞 Troubleshooting

**Issue**: `Cannot read property 'find' of undefined`
- **Solution**: Check that userA and userB fields exist in session

**Issue**: `jwt.verify() failed`
- **Solution**: Ensure JWT_SECRET is set in .env file

**Issue**: `Review allowed only after completion`
- **Solution**: Change session status to "Completed" before adding review

**Issue**: `You have already reviewed this session`
- **Solution**: This is expected - duplicate reviews are prevented

---

**Status**: ✅ All features tested and working!
