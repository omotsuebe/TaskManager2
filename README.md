## Tasks Manager Using Laravel and React

Full-stack web application that allows users to create and share task lists with
others.

### Features

- Create, read, edit and delete tasks
- Filter tasks by status, priority and shared.
- Share tasks created with others using their username
- Pagination with a maximum limit of 20 tasks per page.
- Configurable tasks fetching limits and API keys.
- Continuous Integration (CI): Automated tests run during every pull request or push.
- Instruct Pint to fix code style issues (`./vendor/bin/pint`)
- Support build and run with docker

## Project Setup Backend

### Prerequisites

- Laravel 11
- PHP >= 8.2
- Database: PostgreSQL
- Docker
- Environment: Ensure your local environment meets [ Laravel's requirements](https://laravel.com/docs/11.x/deployment)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/hezecom/TaskManager2.git
    cd TaskManager2
    ```

2. Install dependencies:
    ```sh
    composer install
    ```

3. Copy the [.env.example](http://_vscodecontentref_/0) file to [.env](http://_vscodecontentref_/1) and configure your environment variables:
    ```sh
    cp .env.example .env
    ```

4. Generate an application key:
    ```sh
    php artisan key:generate
    ```

5. Run database migrations:
    ```sh
     php artisan migrate
    ```

### Serving the Application
To serve the application locally, use the following command
   ```sh
    php artisan serve

    The application will be available at http://localhost:8000
   ```
### Or Using Docker for Backend

Follow these steps

 - Clone the repository
 - `cp .env.example .env`
 - `docker-compose build`
 - `docker-compose up -d` 
 - `docker exec task_backend composer install`
 - `cp backend/.env.example backend/.env`
 - `docker exec task_backend php artisan key:generate`
 - `docker exec task_backend php  artisan  migrate`
 - `docker exec task_backend php  artisan  cache:clear`
 - `docker exec task_backend php  artisan  optimize`
 - Access: `http://localhost:8000`
 - Terminate: `docker-compose down`

### Usage

**The Application API**

- **Filters:** Filter by status, priority, shared.
- **Pagination:** Navigate through tasks with a maximum of 20 tasks per page.

**Example API Endpoints**

**Fetch Tasks:** 
- `GET /api/v1/tasks`

**Optional Query parameters:**

- `shared:` Search keywords.
- `status:` Filter by category (e.g `complete` | `incomplete`).
- `priority:` Filter by source (`high` | `medium` | `low`).
- `limit:` Number of tasks per page (default: 20, max: 20).
- `page:` Current page number (default: 1)

**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```
**Optional Params:**
```json
{
    "shared": "shared",
    "status": "complete",
    "priority": "high",
    "limit": 20,
    "page": 1
}
```

**Response:**
```json
{
    "result": true,
    "status": "success",
    "message": "Tasks fetched",
    "data": {
        "tasks": [
            {
                "id": 1,
                "title": "Sample Task",
                "category": "General",
                "priority": "high",
                "status": "incomplete",
                "created_at": "2023-10-01T12:00:00.000000Z",
                "updated_at": "2023-10-01T12:00:00.000000Z",
                "user": {
                    "id": 1,
                    "name": "John Doe",
                    "email": "john.doe@example.com",
                    "username": "johndoe"
                }
            }
        ],
        "meta": {
            "current_page": 1,
            "last_page": 1,
            "per_page": 10,
            "total": 1
        }
    }
}
```

**Create Task:** 
- `POST /api/v1/tasks`

**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```

**Body:**
```json
{
    "title": "New Task",
    "category": "Frontend",
    "priority": "medium"
}
```

**Update Task:** 
- `PUT /api/v1/tasks/{task}`

**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```

**Body:**
```json
{
    "title": "Updated Task",
    "category": "Database",
    "priority": "high",
    "status": "complete"
}
```

**Share Task:** 
- `PUT /api/v1/tasks/share`

**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```

**Body:**
```json
{
    "tasks": [1],
    "username": "anotheruser"
}
```

**Delete Task:** 
- `DELETE /api/v1/tasks/{task}`

**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```

### User Authentication

**Register User:** 
- `POST /api/v1/auth/register`
```json
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password",
    "username": "username"
}
```

**Login User:** 
- `POST /api/v1/auth/login`
```json
{
    "email": "john.doe@example.com",
    "password": "password"
}
```

### Email Verification

**Verify Email with OTP:** 
- `POST /api/v1/auth/verify-email`
```json
{
    "email": "john.doe@example.com",
    "code": "123456"
}
```

**Resend OTP for Email Verification:** 
- `POST /api/v1/auth/resend-code`
```json
{
    "email": "john.doe@example.com"
}
```

### Forgot Password

**Request Password Reset:** 
- `POST /api/v1/auth/forgot-password`
```json
{
    "email": "john.doe@example.com"
}
```

**Reset Password:** 
- `POST /api/v1/auth/reset-password`
```json
{
    "code": "otp",
    "email": "john.doe@example.com",
    "password": "newpassword"
}
```

### Manage Profile

**Fetch Authenticated User:** 
- `GET /api/v1/auth/profile`

**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```

**Update User Profile:** 
- `PUT /api/v1/auth/update-profile`

**Body:**
```json
{
    "name": "John Doe",
    "username": "newusername"
}
```
**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```

**Change User Password:** 
- `PUT /api/v1/auth/change-password`

**Body:**
```json
{
    "current_password": "currentpassword",
    "new_password": "newpassword"
}
```

**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```

**Logout User:** 
- `POST /api/v1/auth/logout`

**Headers:**
```json
{
    "Authorization": "Bearer user-access-token"
}
```

For the complete documention for
Authentication and Task(CRUD)
[Visit the Posman Docs for more](https://documenter.getpostman.com/view/8772623/2sAXjF8aZQ)

### Email Notification
Sending notifications can take time, especially if the channel needs to make an external API call to deliver the notification. To speed up your application's response time, let your notification be queued by adding the `ShouldQueue` interface and `Queueable` trait to your class.

```php
class AppNotification extends Notification implements ShouldQueue
{
    use Queueable;
    // ...
}
```
[Learn more](https://laravel.com/docs/11.x/notifications)


### Running Tests

To run the tests, use the following command:
```php
php artisan test
```
For docker:
```php
docker exec task_backend php artisan test
```

## Project Setup Frontend

### Prerequisites

- Node.js >= 20.x
- npm

### Installation

1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, use the following command:
```sh
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, use the following command:
```sh
npm run build
```
- **Using docker to build**

`docker build -f docker/react/Dockerfile -t taskfront-app .`

`docker run -p 80:80 taskfront-app`

### Usage

**Navigating the Application**

- **Home Page:** View a list of tasks.
- **Create Task:** Use the form to create a new task.
- **Edit Task:** Edit an existing task.
- **Share Task:** Share tasks with others
- **Delete Task:** Remove a task from the list.
- **Filters:** Filter by status, priority, shared.


### Deployment

The production SPA build will be available at `build/client/` folder.

You can then serve your app from any HTTP server of your choosing. The server should be configured to serve multiple paths from a single root `/index.html` file (commonly called "SPA fallback"). Other steps may be required if the server doesn't directly support this functionality.

For a simple example, you could use [sirv-cli](https://www.npmjs.com/package/sirv-cli):

```shellscript
npx sirv-cli build/client/ --single
```

### Running Tests

To run the tests, use the following command:
```sh
npm test
```