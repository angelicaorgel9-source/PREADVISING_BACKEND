# Backend API Endpoints - Irregular Student Flow

## Updated Endpoints

### 1. **Get Sections for a Year Level**
```
GET /bridge/sections/{year_level}
```

**Purpose**: Get sections for a given year level

**Parameters**:
- `year_level`: Integer (1, 2, 3, 4) OR string "irregular"

**Response (for regular year levels 1-4)**:
```json
{
  "success": true,
  "data": [
    {
      "name": "1A",
      "year_level": 1,
      "active": true
    },
    {
      "name": "1B",
      "year_level": 1,
      "active": false
    }
  ]
}
```

**Response (for "irregular" year level)**:
```json
{
  "success": true,
  "data": [],
  "message": "Irregular students do not have sections. Use /students/irregular to get irregular student list."
}
```

**Key Changes**:
- ✅ Rejects "irregular" as a valid year_level
- ✅ Returns empty sections for irregular (not forcing them into BSIT 1st Year)
- ✅ Includes helpful message for developers

---

### 2. **Get Students by Section (Regular Only)**
```
GET /bridge/students/{section}
```

**Purpose**: Get students in a specific section (regular students only)

**Parameters**:
- `section`: String (e.g., "1A", "2B", etc.)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "number": "202310010",
      "status": "regular",
      "section": "1A",
      "year_level": 1
    }
  ]
}
```

**Key Changes**:
- ✅ Explicitly filters OUT students with `status: "irregular"`
- ✅ Only returns regular students or students with missing status
- ✅ Will not contaminate regular student lists with irregular students

**Query Used**:
```python
{
  "$and": [
    {
      "$or": [
        {"section": {"$regex": f"^{section}$", "$options": "i"}},
        {"Section": {"$regex": f"^{section}$", "$options": "i"}}
      ]
    },
    {
      "$or": [
        {"status": {"$regex": "^regular$", "$options": "i"}},
        {"status": {"$exists": False}}  # Treat missing status as regular
      ]
    }
  ]
}
```

---

### 3. **Get Irregular Students (Primary)**
```
GET /bridge/students/irregular
```

**Purpose**: Get all irregular students

**Parameters**: None

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "number": "202310050",
      "status": "irregular",
      "section": null,
      "year_level": null
    }
  ]
}
```

**Key Points**:
- ✅ Returns ONLY students with `status: "irregular"`
- ✅ No sections or year levels forced
- ✅ Frontend can safely use for irregular student list

---

### 4. **Get Students by Category (New)**
```
GET /bridge/students/by-category?category=irregular
```

**Purpose**: Get students filtered by category (designed for future extensibility)

**Parameters**:
- `category`: String (currently supports: "irregular")

**Response** (when category=irregular):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "number": "202310050",
      "status": "irregular",
      "section": null,
      "year_level": null
    }
  ],
  "category": "irregular"
}
```

**Error Response** (unknown category):
```json
{
  "success": false,
  "error": "Unknown category: xyz"
}
```

**Key Points**:
- ✅ Provides alternative way to fetch irregular students
- ✅ Designed to be extended for other categories in future
- ✅ More flexible than hardcoded endpoint

---

### 5. **Get Student Details**
```
GET /bridge/student/{student_no}
```

**Purpose**: Get student details and grades

**Parameters**:
- `student_no`: String (student ID)

**Response** (regular student):
```json
{
  "success": true,
  "data": {
    "student": {
      "_id": "507f1f77bcf86cd799439011",
      "student_no": "202310010",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "regular",
      "section": "1A",
      "year_level": 1,
      "number": "202310010"
    },
    "grades": [
      {
        "code": "CC101",
        "title": "Introduction to Computer Science",
        "units": "3",
        "finalGrade": "1.25",
        "prelim": "1.50",
        "midterm": "1.00",
        "preFinal": "1.25",
        "final": "1.25",
        "instructor": "Dr. Smith",
        "semester": "1",
        "schoolYear": "2023-2024",
        "status": "completed"
      }
    ]
  }
}
```

**Response** (irregular student):
```json
{
  "success": true,
  "data": {
    "student": {
      "_id": "507f1f77bcf86cd799439012",
      "student_no": "202310050",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "status": "irregular",
      "section": null,
      "year_level": null,
      "number": "202310050"
    },
    "grades": [
      {
        "code": "CC101",
        "title": "Introduction to Computer Science",
        "units": "3",
        "finalGrade": "1.50",
        "prelim": "1.75",
        "midterm": "1.25",
        "preFinal": "1.50",
        "final": "1.50",
        "instructor": "Dr. Smith",
        "semester": "1",
        "schoolYear": "2023-2024",
        "status": "completed"
      }
    ]
  }
}
```

**Key Points**:
- ✅ Works for both regular and irregular students
- ✅ Returns student data as-is (no forced sections for irregular)
- ✅ Grades load regardless of student status
- ✅ Frontend can safely display irregular students without section data

---

## Frontend Data Flow

### Regular Student Flow
```
User navigates to Year Level page
  ↓
User clicks "BSIT 1st Year" (year_level=1)
  ↓
GET /bridge/sections/1
  Returns: [{ name: "1A", ... }, { name: "1B", ... }, ...]
  ↓
User clicks Section "1A"
  ↓
GET /bridge/students/1A
  Returns: [Regular students in 1A] (irregular students excluded)
  ↓
User clicks Student
  ↓
GET /bridge/student/{student_no}
  Returns: { student: {..., section: "1A"}, grades: [...] }
```

### Irregular Student Flow (NEW)
```
User navigates to Year Level page
  ↓
User clicks "Irregular Students" (special route, not year_level)
  ↓
Directly navigates to /irregular-list (no sections step!)
  ↓
Frontend calls GET /bridge/students/irregular
  Returns: [All irregular students]
  ↓
User clicks Irregular Student
  ↓
GET /bridge/student/{student_no}
  Returns: { student: {..., section: null, status: "irregular"}, grades: [...] }
```

---

## Query Filters Applied

### In `/bridge/students/{section}` - BEFORE (BROKEN)
```python
# Returned ALL students matching section, including irregular!
{
  "$or": [
    {"section": {"$regex": f"^{section}$", "$options": "i"}},
    {"Section": {"$regex": f"^{section}$", "$options": "i"}},
  ]
}
```

### In `/bridge/students/{section}` - AFTER (FIXED)
```python
# Now explicitly excludes irregular students
{
  "$and": [
    {
      "$or": [
        {"section": {"$regex": f"^{section}$", "$options": "i"}},
        {"Section": {"$regex": f"^{section}$", "$options": "i"}},
      ]
    },
    {
      "$or": [
        {"status": {"$regex": "^regular$", "$options": "i"}},
        {"status": {"$exists": False}}  # Missing status = regular
      ]
    }
  ]
}
```

---

## Database Requirements

All endpoints assume:

1. **Students Collection Schema**:
   - `student_no` or `number` or `student_number`: Student ID (string)
   - `name` or `full_name`: Student name (string)
   - `email` or `gsuite` or `email_address`: Email (string)
   - `status`: Either "regular" or "irregular" (required!)
   - `section`: Section code if regular, null/empty if irregular (string/null)
   - `year_level`: Year if regular, null/empty if irregular (integer/null)

2. **Status Values**:
   - `"regular"`: Student is a regular student in a section
   - `"irregular"`: Student is irregular (no section assignment)
   - Missing status: Treated as "regular"

3. **Sections Collection**:
   - `name` or `section_name`: Section name (string)
   - `year_level` or `year`: Year level (1, 2, 3, 4)
   - `active`: Boolean flag (optional)

---

## Troubleshooting

### Irregular students still appearing in regular section lists
**Cause**: `/bridge/students/{section}` not excluding irregular students properly
**Solution**: Verify the filter includes the status check and restart backend

### Regular students appearing in irregular list
**Cause**: Some students have both status and section data
**Solution**: Audit database; irregular students should have `section: null` or empty string

### Cannot reach /irregular-list page
**Cause**: Route not added to frontend
**Solution**: Verify `App.jsx` has route: `<Route path="/irregular-list" element={<IrregularList />} />`

### Grades not loading for irregular students
**Cause**: Grade endpoint requires section data
**Solution**: Grade endpoint shouldn't require section; check `academic_records_col` query uses student_no

---

## Testing with cURL

```bash
# Get sections for Year 1 (regular)
curl http://localhost:5000/bridge/sections/1

# Get sections for "irregular" (should be empty)
curl http://localhost:5000/bridge/sections/irregular

# Get students in section 1A (only regular students)
curl http://localhost:5000/bridge/students/1A

# Get all irregular students
curl http://localhost:5000/bridge/students/irregular

# Get by category
curl http://localhost:5000/bridge/students/by-category?category=irregular

# Get student details (works for both regular and irregular)
curl http://localhost:5000/bridge/student/202310010
```
