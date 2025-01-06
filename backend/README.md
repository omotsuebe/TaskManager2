## Tasks Manager

Full-stack web application that allows users to create and share task lists with
others.

### Features

- Create, read, edit and delete tasks
- Filter tasks by status, priority and shared.
- Share tasks created with others using their username
- Pagination with a maximum limit of 20 articles per page.
- Configurable article fetching limits and API keys.
- Continuous Integration (CI): Automated tests run during every pull request or push.
- Instruct Pint to fix code style issues (`./vendor/bin/pint`)
- Support build and run with docker

## Project Setup

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
 - `docker-compose build`
 - `docker-compose up -d` 
 - `docker exec task_backend composer install`
 - `cp .env.example .env`
 - `docker exec task_backend php artisan key:generate`
 - `docker exec task_backend php  artisan  migrate`
 - `docker exec task_backend php  artisan  cache:clear`
 - `docker exec task_backend php  artisan  optimize`
 - Access: `http://localhost:8000`
 - Terminate: `docker-compose down`

### Usage

**Search and Filter**

Use the search and filtering features to retrieve tasks based on:

- **Search Queries:** Match titles or descriptions.
- **Filters:** Filter by status, priority, shared.
- **Pagination:** Navigate through tasks with a maximum of 20 tasks per page.

**Example API Endpoints**

**Fetch Tasks:** 
- `GET /api/v1/tasks`

**Optional Query parameters:**

- `shared:` Search keywords.
- `status:` Filter by category (e.g `complete` | `incomplete`).
- `priority:` Filter by source (`high` | `medium` | `low`).
- `limit:` Number of articles per page (default: 20, max: 20).
- `page:` Current page number (default: 1)

**Sample API Response**
When fetching tasks, the API returns a structured JSON response:
```json
{
    "result": true,
    "status": "success",
    "message": "Task fetched",
    "data": {
        "tasks": [
            {
                "id": 9,
                "title": "edite now",
                "category": "General",
                "priority": "low",
                "sort_order": false,
                "created_at": "2025-01-06T04:14:52.000000Z",
                "updated_at": "2025-01-06T04:14:52.000000Z",
                "status": "incomplete",
                "canDelete": true,
                "user": {
                    "id": 1,
                    "name": "Omo heze",
                    "email": "code@appwiz.dev",
                    "username": "coder",
                    "updated_at": "2025-01-04T20:27:15.000000Z",
                    "created_at": "2025-01-03T23:35:38.000000Z"
                }
            },
        ],
        "meta": {
            "current_page": 1,
            "last_page": 10,
            "per_page": 10,
            "total": 100
        }
    }
}
```

- `GET /api/v1/tasks/{id}`
```json
{
    "result": true,
    "status": "success",
    "message": "Article fetched",
    "data": {
        "tasks": {
            "id": 9,
                "title": "edite now",
                "category": "General",
                "priority": "low",
                "sort_order": false,
                "created_at": "2025-01-06T04:14:52.000000Z",
                "updated_at": "2025-01-06T04:14:52.000000Z",
                "status": "incomplete",
                "canDelete": true,
                "user": {
                    "id": 1,
                    "name": "Omo heze",
                    "email": "code@appwiz.dev",
                    "username": "coder",
                    "updated_at": "2025-01-04T20:27:15.000000Z",
                    "created_at": "2025-01-03T23:35:38.000000Z"
                }
        }
    }
}

```
For the complete documention for
Authentication and Task(CRUD)
[Visit the Posman Docs for more](https://documenter.getpostman.com/view/8772623/2sAXjF8aZQ)

### Email Notification
Sending notifications can take time, especially if the channel needs to make an external API call to deliver the notification. To speed up your application's response time, let your notification be queued by adding the `ShouldQueue` interface and `Queueable` trait to your class.

```json
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

