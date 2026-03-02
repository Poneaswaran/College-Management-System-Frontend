# 🔔 LLM Prompt — Production-Grade Notification System (Django 6.0 + Strawberry GraphQL + SSE)

> Copy the entire content below (from the `---` separator to the end) and paste it as a prompt to your LLM for the backend implementation.

---

## Context

I am building a **College Management System** backend with the following stack:

- **Python 3.12+**
- **Django 6.0**
- **Strawberry GraphQL** (NOT Graphene) for all queries, mutations, and subscriptions
- **Django REST Framework** — used **only** for the SSE (Server-Sent Events) streaming endpoint
- **PostgreSQL** as the database
- **Redis** for pub/sub (real-time notification broadcasting)
- Business logic MUST reside strictly in `services.py` files — views, resolvers, and serializers must be thin wrappers

The project already has these existing apps:
- `users` (with `User` model that has `role` field — `STUDENT`, `FACULTY`, `HOD`, `ADMIN`)
- `attendance` (attendance sessions, marks)
- `assignments` (assignments, submissions, grades)
- `students` (student profiles)
- `academics` (departments, courses, sections, subjects, timetable)

---

## Objective

Create a **new Django app called `notifications`** that provides a production-grade, real-time notification system with the following capabilities:

1. **Persist notifications** in the database (queryable via GraphQL)
2. **Deliver in real-time** via SSE (Server-Sent Events) over a REST endpoint
3. **Category-based sub-modules** — each notification domain (attendance, assignments, grades, system) has its own subfolder with isolated GraphQL types, mutations, and service logic
4. **Batch operations** — mark all as read, bulk dismiss
5. **Notification preferences** — users can opt-in/out of specific notification types
6. **Auto-generation** — signals/services auto-create notifications when events happen (attendance opened, assignment graded, etc.)
7. **Production-grade** — proper error handling, logging, pagination, database indexes, connection management

---

## Required Folder Structure

Create this **exact** folder structure inside the new `notifications` app:

```
notifications/
├── __init__.py
├── apps.py
├── admin.py
├── models.py                          # Core Notification, NotificationPreference models
├── constants.py                       # Notification type enums, priority levels, category constants
├── signals.py                         # Django signals to auto-create notifications
├── receivers.py                       # Signal receivers (connected in apps.py ready())
├── urls.py                            # REST URL patterns (SSE endpoint only)
├── middleware.py                       # SSE authentication middleware
│
├── services/                          # All business logic lives here
│   ├── __init__.py
│   ├── notification_service.py        # Core CRUD: create, mark_read, mark_all_read, dismiss, get_unread_count
│   ├── preference_service.py          # User preference management
│   ├── broadcast_service.py           # Redis pub/sub broadcasting for SSE
│   └── cleanup_service.py             # Periodic cleanup of old/dismissed notifications
│
├── graphql/                           # Root GraphQL schema for notifications
│   ├── __init__.py
│   ├── schema.py                      # Strawberry schema stitching — combines all sub-module schemas
│   ├── types.py                       # Core Strawberry types: NotificationType, NotificationPreferenceType
│   ├── queries.py                     # Root queries: my_notifications, unread_count, notification_preferences
│   ├── mutations.py                   # Root mutations: mark_read, mark_all_read, dismiss, update_preferences
│   ├── subscriptions.py               # Strawberry subscription (optional, if using WebSocket alongside SSE)
│   └── permissions.py                 # Strawberry permission classes (IsAuthenticated, IsOwner)
│
├── attendance/                        # Attendance notification sub-module
│   ├── __init__.py
│   ├── services.py                    # create_attendance_opened_notification, create_low_attendance_alert
│   └── graphql/
│       ├── __init__.py
│       ├── types.py                   # AttendanceNotificationPayload (extra fields specific to attendance)
│       └── mutations.py               # (if any attendance-specific notification mutations)
│
├── assignments/                       # Assignment notification sub-module
│   ├── __init__.py
│   ├── services.py                    # create_assignment_published_notification, create_assignment_graded_notification
│   └── graphql/
│       ├── __init__.py
│       ├── types.py                   # AssignmentNotificationPayload
│       └── mutations.py
│
├── grades/                            # Grade notification sub-module
│   ├── __init__.py
│   ├── services.py                    # create_grade_published_notification, create_result_declared_notification
│   └── graphql/
│       ├── __init__.py
│       ├── types.py                   # GradeNotificationPayload
│       └── mutations.py
│
├── system/                            # System / admin announcements sub-module
│   ├── __init__.py
│   ├── services.py                    # create_announcement_notification, create_fee_reminder, create_system_alert
│   └── graphql/
│       ├── __init__.py
│       ├── types.py                   # SystemNotificationPayload
│       └── mutations.py               # send_announcement (admin only)
│
├── sse/                               # SSE (Server-Sent Events) delivery module
│   ├── __init__.py
│   ├── views.py                       # Django REST StreamingHttpResponse SSE view
│   ├── serializers.py                 # Notification serializer for SSE JSON payloads
│   ├── authentication.py              # Token-based auth for SSE connections (JWT from query param)
│   └── connection_manager.py          # Track active SSE connections, heartbeat, reconnection
│
├── management/
│   └── commands/
│       ├── __init__.py
│       └── cleanup_notifications.py   # Management command to purge old notifications (cron job)
│
├── migrations/
│   └── __init__.py
│
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_notification_service.py
    ├── test_broadcast_service.py
    ├── test_graphql_queries.py
    ├── test_graphql_mutations.py
    └── test_sse_view.py
```

---

## Models (`models.py`)

### `Notification`

```python
class Notification(models.Model):
    """Core notification model — one row per notification per recipient."""

    class NotificationType(models.TextChoices):
        # Attendance
        ATTENDANCE_SESSION_OPENED = "ATTENDANCE_SESSION_OPENED"
        ATTENDANCE_SESSION_CLOSED = "ATTENDANCE_SESSION_CLOSED"
        LOW_ATTENDANCE_ALERT = "LOW_ATTENDANCE_ALERT"
        ATTENDANCE_MARKED = "ATTENDANCE_MARKED"
        # Assignments
        ASSIGNMENT_PUBLISHED = "ASSIGNMENT_PUBLISHED"
        ASSIGNMENT_DUE_SOON = "ASSIGNMENT_DUE_SOON"
        ASSIGNMENT_OVERDUE = "ASSIGNMENT_OVERDUE"
        ASSIGNMENT_GRADED = "ASSIGNMENT_GRADED"
        ASSIGNMENT_RETURNED = "ASSIGNMENT_RETURNED"
        SUBMISSION_RECEIVED = "SUBMISSION_RECEIVED"
        # Grades
        GRADE_PUBLISHED = "GRADE_PUBLISHED"
        RESULT_DECLARED = "RESULT_DECLARED"
        # System
        ANNOUNCEMENT = "ANNOUNCEMENT"
        FEE_REMINDER = "FEE_REMINDER"
        SYSTEM_ALERT = "SYSTEM_ALERT"
        PROFILE_UPDATE = "PROFILE_UPDATE"

    class Priority(models.TextChoices):
        LOW = "LOW"
        MEDIUM = "MEDIUM"
        HIGH = "HIGH"
        URGENT = "URGENT"

    class Category(models.TextChoices):
        ATTENDANCE = "ATTENDANCE"
        ASSIGNMENT = "ASSIGNMENT"
        GRADE = "GRADE"
        SYSTEM = "SYSTEM"

    id = models.BigAutoField(primary_key=True)
    recipient = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="notifications")
    notification_type = models.CharField(max_length=50, choices=NotificationType.choices)
    category = models.CharField(max_length=20, choices=Category.choices)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)

    title = models.CharField(max_length=255)
    message = models.TextField()
    action_url = models.CharField(max_length=500, blank=True, default="")  # Frontend route to navigate to

    # Metadata — JSON field for category-specific extra data
    metadata = models.JSONField(default=dict, blank=True)  # e.g., {"session_id": 42, "subject_name": "Math"}

    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    is_dismissed = models.BooleanField(default=False)
    dismissed_at = models.DateTimeField(null=True, blank=True)

    # Actor — who triggered this notification (nullable for system-generated)
    actor = models.ForeignKey("users.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="triggered_notifications")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # Auto-dismiss after this time

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["recipient", "-created_at"]),
            models.Index(fields=["recipient", "is_read", "-created_at"]),
            models.Index(fields=["recipient", "category", "-created_at"]),
            models.Index(fields=["notification_type"]),
            models.Index(fields=["expires_at"]),
        ]
```

### `NotificationPreference`

```python
class NotificationPreference(models.Model):
    """Per-user, per-category notification preferences."""

    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="notification_preferences")
    category = models.CharField(max_length=20, choices=Notification.Category.choices)
    is_enabled = models.BooleanField(default=True)       # Master toggle for category
    is_sse_enabled = models.BooleanField(default=True)   # Real-time SSE delivery
    is_email_enabled = models.BooleanField(default=False) # Email delivery (future)

    class Meta:
        unique_together = ["user", "category"]
```

---

## SSE Implementation Requirements (`sse/views.py`)

Use **Django REST Framework** for the SSE endpoint. This is the **only** REST endpoint in the entire notifications app — everything else is GraphQL.

### SSE Endpoint: `GET /api/notifications/stream/`

```
Requirements:
1. Accept JWT token via query parameter: /api/notifications/stream/?token=<jwt>
   (EventSource API doesn't support custom headers)
2. Use StreamingHttpResponse with content_type="text/event-stream"
3. Use Redis pub/sub — subscribe to channel "notifications:{user_id}"
4. Send heartbeat (":heartbeat\n\n") every 30 seconds to keep connection alive
5. On new notification, broadcast via Redis pub/sub → all SSE connections for that user receive it
6. Handle client disconnection gracefully (cleanup Redis subscription)
7. Include "retry: 3000\n" in initial response for auto-reconnection
8. Set proper headers: Cache-Control: no-cache, Connection: keep-alive, X-Accel-Buffering: no
9. Each SSE event should have: id (notification ID), event (notification type), data (JSON payload)
```

### SSE Event Format:

```
id: 1234
event: ASSIGNMENT_GRADED
data: {"id": 1234, "title": "Assignment Graded", "message": "Your Math assignment has been graded: A+", "category": "ASSIGNMENT", "priority": "MEDIUM", "action_url": "/student/assignments", "metadata": {"assignment_id": 42, "grade": "A+"}, "created_at": "2026-02-25T08:00:00Z"}

```

### `sse/connection_manager.py`:

```
Requirements:
1. Track active connections per user (for monitoring)
2. Maximum 3 concurrent SSE connections per user (prevent abuse)
3. Auto-close stale connections after 5 minutes of no heartbeat response
4. Log connection open/close events
```

### `sse/authentication.py`:

```
Requirements:
1. Extract JWT from query parameter "token"
2. Validate JWT using the same secret/algorithm as the main auth system
3. Return the authenticated User object
4. Reject expired tokens with appropriate SSE error event
5. Handle token refresh — send "event: auth_expired" so frontend can reconnect with new token
```

---

## Redis Broadcasting (`services/broadcast_service.py`)

```
Requirements:
1. Use redis-py async (or django-redis) for pub/sub
2. Channel naming: "notifications:{user_id}"
3. Publish notification as JSON when created
4. Support broadcasting to multiple users (e.g., all students in a section)
5. Provide bulk_broadcast(user_ids: list[int], notification_data: dict) method
6. Handle Redis connection failures gracefully with logging (don't crash the app)
7. Use connection pooling
```

---

## Core Service (`services/notification_service.py`)

All business logic MUST be in this file. Implement these functions:

---

## Signal Receivers (`receivers.py`)

Connect these signals in `apps.py` → `ready()`:

```
1. post_save on AttendanceSession (status changed to ACTIVE)
   → Notify all students in that section: "Attendance session opened for {subject}"
   → Category: ATTENDANCE, Type: ATTENDANCE_SESSION_OPENED
   → action_url: "/student/mark-attendance"
   → metadata: {"session_id": <id>, "subject_name": <name>, "section_name": <name>}

2. post_save on AttendanceSession (status changed to CLOSED)
   → Notify all students who did NOT mark attendance: "You missed attendance for {subject}"
   → Category: ATTENDANCE, Type: ATTENDANCE_SESSION_CLOSED, Priority: HIGH

3. post_save on Assignment (status changed to PUBLISHED)
   → Notify all students in that section: "New assignment: {title} — due {due_date}"
   → Category: ASSIGNMENT, Type: ASSIGNMENT_PUBLISHED
   → action_url: "/student/assignments"

4. post_save on Grade (created)
   → Notify the student: "Your {assignment_title} has been graded: {grade}"
   → Category: ASSIGNMENT, Type: ASSIGNMENT_GRADED
   → action_url: "/student/assignments"

5. post_save on Submission (created)
   → Notify the faculty: "New submission from {student_name} for {assignment_title}"
   → Category: ASSIGNMENT, Type: SUBMISSION_RECEIVED
   → action_url: "/faculty/assignments"
```

---

## GraphQL Schema (Strawberry)

### Types (`graphql/types.py`):

```python
@strawberry.type
class NotificationType:
    id: int
    notification_type: str
    category: str
    priority: str
    title: str
    message: str
    action_url: str
    metadata: strawberry.scalars.JSON
    is_read: bool
    read_at: Optional[datetime]
    actor_name: Optional[str]      # Resolved from actor.get_full_name()
    created_at: datetime
    time_ago: str                   # Resolved: "2 minutes ago", "1 hour ago", etc.

@strawberry.type
class NotificationConnection:
    notifications: list[NotificationType]
    total_count: int
    unread_count: int
    has_more: bool

@strawberry.type
class NotificationPreferenceType:
    category: str
    is_enabled: bool
    is_sse_enabled: bool
    is_email_enabled: bool
```

### Queries (`graphql/queries.py`):

```python
@strawberry.type
class NotificationQuery:
    @strawberry.field
    def my_notifications(
        self,
        info: strawberry.types.Info,
        category: Optional[str] = None,
        is_read: Optional[bool] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> NotificationConnection: ...

    @strawberry.field
    def unread_count(self, info: strawberry.types.Info, category: Optional[str] = None) -> int: ...

    @strawberry.field
    def my_notification_preferences(self, info: strawberry.types.Info) -> list[NotificationPreferenceType]: ...
```

### Mutations (`graphql/mutations.py`):

```python
@strawberry.type
class NotificationMutation:
    @strawberry.mutation
    def mark_notification_read(self, info: strawberry.types.Info, notification_id: int) -> NotificationType: ...

    @strawberry.mutation
    def mark_all_notifications_read(self, info: strawberry.types.Info, category: Optional[str] = None) -> int: ...

    @strawberry.mutation
    def dismiss_notification(self, info: strawberry.types.Info, notification_id: int) -> bool: ...

    @strawberry.mutation
    def bulk_dismiss_notifications(self, info: strawberry.types.Info, notification_ids: list[int]) -> int: ...

    @strawberry.mutation
    def update_notification_preference(
        self,
        info: strawberry.types.Info,
        category: str,
        is_enabled: Optional[bool] = None,
        is_sse_enabled: Optional[bool] = None,
        is_email_enabled: Optional[bool] = None,
    ) -> NotificationPreferenceType: ...
```

---

## Sub-module Services (example: `attendance/services.py`)

```python
"""
Attendance notification services.
All functions here call notification_service.create_notification() or bulk_create_notifications().
They should be called from signal receivers or directly from attendance app services.
"""

def notify_session_opened(session) -> list[Notification]:
    """Get all students in session's section, bulk-create ATTENDANCE_SESSION_OPENED notifications."""

def notify_session_closed_absent(session) -> list[Notification]:
    """Find students who didn't mark attendance, create HIGH priority notifications."""

def notify_low_attendance(student, subject, percentage) -> Notification:
    """Create URGENT notification when attendance drops below threshold (e.g., 75%)."""
```

Follow the same pattern for `assignments/services.py`, `grades/services.py`, and `system/services.py`.

---

## Django Settings Required

Add these to `settings.py`:

```python
# Redis (for SSE pub/sub)
REDIS_URL = env("REDIS_URL", default="redis://localhost:6379/0")

# Notification settings
NOTIFICATION_SSE_HEARTBEAT_INTERVAL = 30  # seconds
NOTIFICATION_SSE_MAX_CONNECTIONS_PER_USER = 3
NOTIFICATION_CLEANUP_DAYS = 90  # auto-delete notifications older than 90 days
NOTIFICATION_DEFAULT_EXPIRY_HOURS = 168  # 7 days for non-critical notifications

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    ...
    "notifications",
]
```

---

## URL Configuration

In `notifications/urls.py`:
```python
urlpatterns = [
    path("stream/", SSENotificationView.as_view(), name="notification-stream"),
]
```

In project `urls.py`:
```python
urlpatterns = [
    ...
    path("api/notifications/", include("notifications.urls")),
    path("graphql/", GraphQLView.as_view(schema=schema)),
]
```

---

## Management Command (`cleanup_notifications.py`)

```
Create a management command: python manage.py cleanup_notifications
1. Delete all dismissed notifications older than 30 days
2. Delete all read notifications older than NOTIFICATION_CLEANUP_DAYS (90 days)
3. Delete all expired notifications (expires_at < now)
4. Log the count of deleted notifications
5. Designed to run as a daily cron job
```

---

## Important Rules

1. **All business logic MUST reside in `services/` files** — views, resolvers, serializers, and admin are thin wrappers only
2. **Employee will never apply unplanned leave — it is auto-generated** (this is a project-wide rule, keep in mind)
3. Use **Strawberry GraphQL** (NOT Graphene) — use `@strawberry.type`, `@strawberry.field`, `@strawberry.mutation`
4. Use **Django 6.0** features (async views for SSE are acceptable)
5. The SSE endpoint is the **only** REST endpoint — everything else is GraphQL
6. Use `bulk_create()` for notifications that go to multiple users (performance)
7. Add proper **database indexes** (already specified in the Meta class above)
8. Use **Python logging** (`logging.getLogger(__name__)`) in all services
9. Handle all edge cases: user not found, notification not owned by user, Redis down, etc.
10. Write **type hints** for all function signatures
11. Each sub-module (`attendance/`, `assignments/`, `grades/`, `system/`) should be independent — they import from `services/notification_service.py` but never from each other

---

## Implementation Order

Please implement the files in this exact order:

1. `notifications/apps.py` and `notifications/__init__.py`
2. `notifications/constants.py`
3. `notifications/models.py` → then run `makemigrations` and `migrate`
4. `notifications/admin.py`
5. `notifications/services/notification_service.py`
6. `notifications/services/preference_service.py`
7. `notifications/services/broadcast_service.py`
8. `notifications/services/cleanup_service.py`
9. `notifications/graphql/permissions.py`
10. `notifications/graphql/types.py`
11. `notifications/graphql/queries.py`
12. `notifications/graphql/mutations.py`
13. `notifications/graphql/schema.py`
14. `notifications/attendance/services.py`
15. `notifications/assignments/services.py`
16. `notifications/grades/services.py`
17. `notifications/system/services.py`
18. Sub-module `graphql/types.py` files (attendance, assignments, grades, system)
19. Sub-module `graphql/mutations.py` files
20. `notifications/signals.py`
21. `notifications/receivers.py` → wire signals in `apps.py` `ready()`
22. `notifications/sse/authentication.py`
23. `notifications/sse/serializers.py`
24. `notifications/sse/connection_manager.py`
25. `notifications/sse/views.py`
26. `notifications/urls.py`
27. `notifications/middleware.py`
28. `notifications/management/commands/cleanup_notifications.py`
29. All test files
30. Update project `settings.py` and `urls.py`

Create ALL files. Do not skip any file. Do not use placeholder comments like "implement later". Every file must be complete and production-ready.

---
