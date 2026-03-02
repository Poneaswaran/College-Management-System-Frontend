# HOD Attendance Reports — Backend GraphQL API Specification

**Authored for:** Backend Team  
**Frontend Route:** `/hod/attendance-reports` (overview) · `/hod/attendance-reports/:type/:id` (drill-down)  
**Frontend Types:** `src/features/hod/types/attendanceReports.ts`  
**Frontend Queries:** `src/features/hod/graphql/attendanceReports.ts`  
**Date:** 2026-03-02  
**Implementation Status:** ✅ Backend Complete — Pending Manual Testing

---

## Backend Implementation Summary

> **Updated 2026-03-02** — Backend team has confirmed implementation is complete.

### Files Created
- `attendance/graphql/hod_types.py` — HOD-specific Strawberry GraphQL types
- `attendance/graphql/hod_queries.py` — Query resolvers for all three HOD report endpoints

### Files Modified
- `attendance/graphql/queries.py` — Integrated HOD queries into main query class

### Confirmed Business Logic
- ✅ `percentage = (attended / totalClasses) * 100` rounded to 1 decimal
- ✅ `riskLevel` computed server-side (GOOD ≥ 75%, WARNING 60–74%, CRITICAL < 60%)
- ✅ `attended` count includes LATE records
- ✅ `late` counted as a separate field (subset of attended)
- ✅ Results scoped to HOD's department
- ✅ `periodFilter` returns human-readable filter description
- ✅ `periodRecords` limited to 200 most recent, ordered date DESC then period ASC
- ✅ `markedBy` resolves to faculty full name or `"System"`
- ✅ `isManuallyMarked` = true for faculty-override records
- ✅ `students` in class drill-down ordered by `rollNumber ASC`
- ✅ `subjectBreakdown` includes subjects with 0 classes (`totalClasses: 0`, `avgPercentage: 0`)
- ✅ Role-based permission guards on all three resolvers
- ✅ Django system check passes with no errors

### Authorization Roles (Confirmed)
| Endpoint | HOD | PRINCIPAL | ADMIN | STUDENT |
|---|---|---|---|---|
| `hodAttendanceReport` | ✅ own dept | ✅ any dept | ✅ any dept | ❌ |
| `hodStudentAttendanceDetail` | ✅ own dept | ✅ | ✅ | ❌ |
| `hodClassAttendanceDetail` | ✅ own dept | ✅ | ✅ | ❌ |

HOD department resolved from `request.user.faculty_profile.department`. PRINCIPAL/ADMIN may pass `departmentId` to override.

### Database Indexes (Confirmed)
Existing indexes on `AttendanceReport`:
- `(student, subject, semester)` — unique together
- `(student, semester)`
- `(subject, semester)`
- `(attendance_percentage)`
- `(is_below_threshold)`

`attendance_percentage` is pre-computed and stored on the `AttendanceReport` model (not calculated per request).

---

## Overview

The HOD Attendance Reports page gives a Head of Department a full picture of student attendance for their department. It supports three view modes:

| View Mode    | Description                                                  |
|--------------|--------------------------------------------------------------|
| **Students** | Flat list of all students with individual attendance stats   |
| **Classes**  | Aggregated view per section with subject breakdown           |
| **Departments** | Top-level department rollup (relevant when HOD oversees multiple) |

Drill-downs navigate to `/hod/attendance-reports/student/:id` and `/hod/attendance-reports/class/:id`.

---

## 1. Query: `hodAttendanceReport`

The primary overview query. Returns all three views in a single call so the client can switch between them without extra round-trips.

### GraphQL Schema

```graphql
type Query {
  """
  Returns a full attendance report for the HOD's department.
  All filter arguments are optional. When omitted the response
  covers all semesters, subjects, periods, and the full date range
  of the current academic year.
  """
  hodAttendanceReport(
    departmentId: Int        # defaults to the authenticated HOD's department
    semesterId:   Int        # filter to a specific semester
    subjectId:    Int        # filter to a specific subject
    periodNumber: Int        # filter to a specific timetable period slot (1–7)
    dateFrom:     String     # ISO date "YYYY-MM-DD"
    dateTo:       String     # ISO date "YYYY-MM-DD"
  ): HODAttendanceReportData!
}
```

### Response Type Hierarchy

```graphql
type HODAttendanceReportData {
  summaryStats:       AttendanceReportSummaryStats!
  students:           [StudentAttendanceSummary!]!
  classes:            [ClassAttendanceSummary!]!
  departments:        [DepartmentAttendanceSummary!]!
  availablePeriods:   [PeriodSlot!]!
  availableSemesters: [SemesterOption!]!
  availableSubjects:  [SubjectOption!]!
}

type AttendanceReportSummaryStats {
  totalStudents:          Int!
  overallAvgPercentage:   Float!      # 0–100
  criticalCount:          Int!        # students < 60%
  warningCount:           Int!        # students 60–74%
  goodCount:              Int!        # students >= 75%
  totalClassesConducted:  Int!
  departmentName:         String!
  semesterLabel:          String!     # e.g. "Semester III — July–Nov 2025"
  periodFilter:           String!     # human-readable description of active filters
}

type StudentAttendanceSummary {
  studentId:       Int!
  studentName:     String!
  registerNumber:  String!
  rollNumber:      String!
  className:       String!    # "CSE-A · Sem 3"
  sectionId:       Int!
  year:            Int!
  semester:        Int!
  totalClasses:    Int!
  attended:        Int!
  absent:          Int!
  late:            Int!
  percentage:      Float!     # 0–100
  riskLevel:       AttendanceRiskLevel!
  lastAbsentDate:  String     # ISO date, nullable
}

type ClassAttendanceSummary {
  sectionId:              Int!
  className:              String!
  semester:               Int!
  year:                   Int!
  totalStudents:          Int!
  avgPercentage:          Float!
  criticalCount:          Int!
  warningCount:           Int!
  goodCount:              Int!
  totalClassesConducted:  Int!
  subjectBreakdown:       [SubjectClassAttendance!]!
}

type SubjectClassAttendance {
  subjectId:      Int!
  subjectName:    String!
  subjectCode:    String!
  facultyName:    String!
  totalClasses:   Int!
  avgPercentage:  Float!
}

type DepartmentAttendanceSummary {
  departmentId:     Int!
  departmentName:   String!
  departmentCode:   String!
  totalStudents:    Int!
  avgPercentage:    Float!
  criticalCount:    Int!
  warningCount:     Int!
  goodCount:        Int!
  classBreakdown:   [ClassAttendanceSummary!]!
}

type PeriodSlot {
  periodNumber:  Int!
  startTime:     String!   # "09:00"
  endTime:       String!   # "09:50"
  label:         String!   # "Period 1 (09:00–09:50)"
}

type SemesterOption {
  id:     Int!
  label:  String!
}

type SubjectOption {
  id:    Int!
  name:  String!
  code:  String!
}

enum AttendanceRiskLevel {
  GOOD      # >= 75%
  WARNING   # 60–74%
  CRITICAL  # < 60%
}
```

### Business Logic Requirements

- `percentage` = `(attended / totalClasses) * 100`, rounded to 1 decimal.
- `riskLevel` is derived server-side using the thresholds above; do not make the client calculate it.
- `avgPercentage` on `ClassAttendanceSummary` = mean of all student percentages in that section.
- `attendedCount` should include LATE records (late = physically present but marked late).
- `late` count is separate from `attended` — it counts the subset of present records marked as LATE.
- The `periodFilter` string should be a readable summary like `"Period 2 (09:50–10:40) · CS301"` or `"All Periods · All Subjects"`.
- `availablePeriods`, `availableSemesters`, `availableSubjects` must reflect what is **actually configured** in the department's timetable — not a hard-coded list.
- Results are scoped to the HOD's own department unless an explicit `departmentId` is provided (for super-admin use).

---

## 2. Query: `hodStudentAttendanceDetail`

Drill-down for a single student. Shows per-subject breakdown and period-level records.

### GraphQL Schema

```graphql
type Query {
  hodStudentAttendanceDetail(
    studentId:   Int!
    semesterId:  Int
    dateFrom:    String
    dateTo:      String
  ): StudentAttendanceDetail!
}

type StudentAttendanceDetail {
  studentId:        Int!
  studentName:      String!
  registerNumber:   String!
  rollNumber:       String!
  className:        String!
  semester:         Int!
  year:             Int!
  subjectSummaries: [SubjectAttendanceDetail!]!
  periodRecords:    [StudentPeriodRecord!]!
}

type SubjectAttendanceDetail {
  subjectId:     Int!
  subjectName:   String!
  subjectCode:   String!
  facultyName:   String!
  totalClasses:  Int!
  attended:      Int!
  absent:        Int!
  late:          Int!
  percentage:    Float!
  riskLevel:     AttendanceRiskLevel!
}

type StudentPeriodRecord {
  date:             String!           # "YYYY-MM-DD"
  subjectName:      String!
  subjectCode:      String!
  periodLabel:      String!           # "Period 3 (10:55–11:45)"
  status:           AttendanceRecordStatus!
  markedBy:         String!           # faculty name or "System"
  isManuallyMarked: Boolean!
}

enum AttendanceRecordStatus {
  PRESENT
  ABSENT
  LATE
}
```

### Business Logic Requirements

- Return `periodRecords` ordered by `date DESC`, then `periodNumber ASC` (most recent first — confirmed by backend).
- `markedBy` should resolve to the faculty's full name, not their user ID.
- `isManuallyMarked` = true when the record was created or overridden by a faculty manually (not by the student's own QR scan).
- Guard: Only the student's HOD (same department) may query this. Return `UNAUTHENTICATED` error for other roles.

---

## 3. Query: `hodClassAttendanceDetail`

Drill-down for a class/section. Returns all students in the section with their summaries, plus subject breakdown.

### GraphQL Schema

```graphql
type Query {
  hodClassAttendanceDetail(
    sectionId:  Int!
    semesterId: Int
    subjectId:  Int
    dateFrom:   String
    dateTo:     String
  ): ClassAttendanceDetail!
}

type ClassAttendanceDetail {
  sectionId:        Int!
  className:        String!
  semester:         Int!
  year:             Int!
  students:         [StudentAttendanceSummary!]!
  subjectBreakdown: [SubjectClassAttendance!]!
}
```

### Business Logic Requirements

- `students` list ordered by `rollNumber ASC`.
- `subjectBreakdown` should include every subject mapped to this section in the timetable, even if no classes have been conducted yet (show `totalClasses: 0`, `avgPercentage: 0`).
- Guard: HOD can only query sections belonging to their department.

---

## 4. Authentication & Authorization

| Query                        | Allowed Roles              |
|------------------------------|----------------------------|
| `hodAttendanceReport`        | HOD, PRINCIPAL, ADMIN      |
| `hodStudentAttendanceDetail` | HOD, PRINCIPAL, ADMIN      |
| `hodClassAttendanceDetail`   | HOD, PRINCIPAL, ADMIN      |

- The HOD's department is determined from `request.user.faculty_profile.department`.
- An explicit `departmentId` argument overrides this only for PRINCIPAL and ADMIN roles.

---

## 5. Performance Notes

- `hodAttendanceReport` is expected to return up to ~500 students for a mid-size department. Ensure the query is backed by:
  - An index on `AttendanceReport(student, subject)`.
  - Pre-computed `attendance_percentage` stored on the `AttendanceReport` model (not calculated on the fly per request).
- Consider caching the overview response for 5 minutes (per department, per filter set) using Django's cache framework.
- `periodRecords` in `hodStudentAttendanceDetail` can grow large. Limit to 200 most recent records by default; add `first: Int` / `after: String` pagination args if needed.

---

## 6. Django Model Mapping

| GraphQL Field             | Django Model / Field                                              |
|---------------------------|-------------------------------------------------------------------|
| `studentId`               | `Student.id`                                                      |
| `registerNumber`          | `Student.register_number`                                         |
| `rollNumber`              | `Student.roll_number`                                             |
| `sectionId`               | `Section.id`                                                      |
| `className`               | `Section.name`                                                    |
| `totalClasses`            | `AttendanceReport.total_classes`                                  |
| `attended`                | `AttendanceReport.classes_attended`                               |
| `absent`                  | `AttendanceReport.classes_absent`                                 |
| `late`                    | Annotated count of `AttendanceRecord.status == 'LATE'`            |
| `percentage`              | `AttendanceReport.attendance_percentage`                          |
| `periodLabel`             | Derived from `TimetableEntry.period_definition`                   |
| `isManuallyMarked`        | `AttendanceRecord.is_manually_marked`                             |
| `markedBy`                | `AttendanceRecord.marked_by_faculty.get_full_name()` or "System"  |
| `availablePeriods`        | `PeriodDefinition.objects.filter(timetable__department=dept)`     |

---

## 7. Example Frontend Call

```typescript
// Overview
const data = await client.query<HODAttendanceReportResponse>({
  query: GET_HOD_ATTENDANCE_REPORT,
  variables: { semesterId: 3, periodNumber: 1 },
  fetchPolicy: 'network-only',
});

// Student drill-down
const detail = await client.query<HODStudentAttendanceDetailResponse>({
  query: GET_HOD_STUDENT_ATTENDANCE_DETAIL,
  variables: { studentId: 42 },
  fetchPolicy: 'network-only',
});

// Class drill-down
const classDetail = await client.query<HODClassAttendanceDetailResponse>({
  query: GET_HOD_CLASS_ATTENDANCE_DETAIL,
  variables: { sectionId: 1, subjectId: 5 },
  fetchPolicy: 'network-only',
});
```

---

## 8. Error Handling Contract

All queries should return standard GraphQL errors using Strawberry's error format:

```json
{
  "errors": [
    {
      "message": "You do not have permission to view this department's data.",
      "extensions": { "code": "UNAUTHENTICATED" }
    }
  ]
}
```

The frontend `errorLink` in Apollo Client will redirect to `/auth/login` on `UNAUTHENTICATED`.

---

## 9. Checklist

### Backend (Confirmed ✅)
- [x] Implement `hodAttendanceReport` resolver — `attendance/graphql/hod_queries.py`
- [x] Implement `hodStudentAttendanceDetail` resolver
- [x] Implement `hodClassAttendanceDetail` resolver
- [x] `riskLevel` computed in resolver (GOOD/WARNING/CRITICAL thresholds)
- [x] `late` count computed via annotated `AttendanceRecord.status == 'LATE'`
- [x] `attendance_percentage` pre-computed and stored on `AttendanceReport` model
- [x] Role-based permission guards on all three resolvers
- [x] HOD-specific types defined in `attendance/graphql/hod_types.py`
- [x] HOD queries integrated into main query class in `attendance/graphql/queries.py`
- [x] Django system check passes with no errors

### Manual Testing (Pending 🔄)
- [ ] Test with Postman/GraphiQL using HOD credentials
- [ ] Verify PRINCIPAL can specify `departmentId` to access other departments
- [ ] Verify HOD receives error when accessing another department's data
- [ ] Test filter combinations: `subjectId` + `periodNumber` together
- [ ] Test `dateFrom` / `dateTo` date range filtering
- [ ] Verify performance with ~500 students (target < 500 ms)
- [ ] Test `hodStudentAttendanceDetail` with student who has 200+ period records
- [ ] Test `hodClassAttendanceDetail` with `subjectId` filter
- [ ] Verify `subjectBreakdown` shows subjects with `totalClasses: 0` for unstarted subjects
- [ ] Verify `periodRecords` ordering: date DESC, then period ASC
- [ ] Test STUDENT role receives `"Only HOD, Principal, or Admin..."` error

### Frontend Integration (Complete ✅)
- [x] Mock data fallback removed from `src/features/hod/api/attendanceReports.ts` — real backend only
- [x] Detail load errors (`studentDetailError`, `classDetailError`) surfaced in hook and rendered in `HODAttendanceReportDetail.tsx`
- [x] Double-fetch on mount fixed in `HODAttendanceReports.tsx` — single `useEffect` drives all filter-based re-fetches
- [ ] End-to-end smoke test on staging with HOD credentials
