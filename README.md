
# ITBD Service

The ITBD Backend is the server-side application designed to handle the core business logic and data management for the ITBD platform. It provides a set of RESTful API endpoints to facilitate user authentication, data processing, and the management of various resources. This project is designed for developers and businesses who need a robust backend solution to integrate with frontend applications or mobile apps.


## Run Locally

Clone the project

```bash
  git clone https://github.com/foysal5965/itbd-backend
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## API References
base api = localhost:5000/api/v1
This section outlines the available routes for the Telemedicine Service API.

### User Routes (/user)
- **GET** `/user` - Get user information.
- **POST** `/user` - Create a new user.

### Authentication Routes
- **POST** `/auth/register` - Register a new user.
- **POST** `/auth/login` - Login with credentials and receive a token.

### Admin Routes
- **GET** `/admin` - Retrieve admin data.
- **GET** `/admin/:id` - Retrieve single admin data.
- **patch** `/admin/:id` - update single admin data.
- **delete** `/admin/:id` - delete single admin data.

### Student Routes (/student)
- **GET** `/student` - List all student.
- **GET** `/student/:id` - get single student.
- **patch** `/student/:id` - update single student.
- **delete** `/student/:id` - delete single student.

### Category Routes (/category)
- **GET** `/category` - List all categories.
- **POST** `/category` - create a new category.
- **patch** `/category` - upadate a new category.
- **delete** `/category` - delete a new category.


### Category Routes (/courses)
- **GET** `/course` - List all courses.
- **POST** `/course` - create a new course.
- **patch** `/course` - upadate a new course.
- **delete** `/course` - delete a new course.

### Student Enrolled Course Routes (/student-enrolled-course)
- **GET** `/student-enrolled-course` - Get all available enrolled course.
- **POST** `/student-enrolled-course` - Create a new create.

