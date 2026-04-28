# Data Resilience Skill

## Overview
When building reporting modules that rely on aggregate models (e.g., `AttendanceReport`), there is a risk that the aggregate data might be missing or out of sync with the raw data (e.g., `StudentAttendance`).

## Best Practices
1. **Resilient Fetching**: Always ensure that GraphQL resolvers or REST endpoints can return a default set of data (e.g., all students in a department) even if the aggregate records are missing.
2. **On-the-fly Calculation**: If performance allows, calculate stats on the fly when the aggregate model is missing.
3. **Graceful Defaults**: Default numerical stats to 0.0 or 0 instead of skipping the record entirely. This ensures the UI remains populated and the user can see which entities have no recorded data.
4. **Deduplication**: When fetching related filter data (like periods or subjects) through many-to-many or reverse-foreign-key relationships, always deduplicate the results (e.g., using a `set` or `distinct()`) to prevent UI components from crashing or displaying redundant options.

## Example Implementation (Python/Django)
```python
for student in students_qs:
    reports = reports_qs.filter(student=student)
    if reports.exists():
        percentage = sum(r.percentage for r in reports) / reports.count()
    else:
        percentage = 0.0 # Graceful default
    
    # ... build response object
```

## UI/UX Considerations
- If data is missing, show "0" or "No records" instead of a blank screen.
- Use `data-testid` on all significant UI elements to ensure they are traceable in tests.
- Always check for duplicate keys when mapping arrays to dropdown options.
