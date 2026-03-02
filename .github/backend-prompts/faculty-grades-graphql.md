# Faculty Grade Submission — Backend GraphQL API Specification

**Authored for:** Backend Team  
**Frontend Route:** `/faculty/grades`  
**Frontend Types:** `src/features/faculty/types/grades.ts`  
**Frontend Queries:** `src/features/faculty/graphql/grades.ts`  
**Stack:** Django + Strawberry GraphQL  
**Date:** 2026-03-02

---

## Overview

The Grade Submission page lets a faculty member:

1. **View** all course sections they are assigned to for the current semester, along with the submission status of each.
2. **Enter / edit marks** (internal + external) per student on a per-course-section basis.
3. **Save as draft** (multiple times, non-destructive).
4. **Submit for approval** — after this, the status changes to `SUBMITTED` and the HOD/admin can approve or reject.

---

## Domain Concepts

| Concept | Description |
|---|---|
| **CourseSection** | A subject taught to a specific section (e.g., CS301 → CSE-A). One faculty can have multiple. |
| **GradeEntry** | Per-student mark record for a specific CourseSection + ExamType. |
| **ExamType** | `INTERNAL`, `EXTERNAL`, `QUIZ`, `LAB`, `ASSIGNMENT` |
| **GradeStatus** | `DRAFT` → `SUBMITTED` → `APPROVED` \| `REJECTED` |
| **LetterGrade** | Derived from percentage using the 10-point GPA scale (see table below). |

### Letter Grade Derivation (10-point GPA, Anna University pattern)

| Percentage Range | Letter Grade | Grade Point |
|---|---|---|
| 91 – 100 | O (Outstanding) | 10 |
| 81 – 90 | A+ | 9 |
| 71 – 80 | A | 8 |
| 61 – 70 | B+ | 7 |
| 51 – 60 | B | 6 |
| 41 – 50 | C | 5 |
| < 41 | F (Fail) | 0 |
| Absent | ABSENT | 0 |
| Withheld | WITHHELD | 0 |

> **Note:** Letter grade and grade point **must be computed on the backend** before returning to the frontend. Do not trust frontend-derived values.

---

## 1. Query: `facultyGrades`

Returns the summary and all course sections for the authenticated faculty member.

### GraphQL Schema (Strawberry)

```python
# types.py

import strawberry
from typing import Optional
from enum import Enum

@strawberry.enum
class GradeStatus(Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

@strawberry.enum
class ExamType(Enum):
    INTERNAL = "INTERNAL"
    EXTERNAL = "EXTERNAL"
    QUIZ = "QUIZ"
    LAB = "LAB"
    ASSIGNMENT = "ASSIGNMENT"

@strawberry.type
class FacultyGradeSummary:
    total_courses: int
    total_submitted: int
    total_draft: int
    total_pending_approval: int
    total_approved: int
    total_rejected: int
    current_semester_label: str   # e.g. "Semester V — Jan–May 2026"

@strawberry.type
class GradeCourseSection:
    id: int
    subject_code: str
    subject_name: str
    section_name: str
    semester: int
    semester_label: str
    department: str
    exam_type: ExamType
    exam_date: str              # ISO date "YYYY-MM-DD"
    internal_max_mark: int
    external_max_mark: int
    total_max_mark: int
    pass_mark: int
    student_count: int
    submitted_count: int        # students who have marks entered
    status: GradeStatus
    last_modified_at: Optional[str]   # ISO datetime
    submitted_at: Optional[str]

@strawberry.type
class FacultyGradesData:
    summary: FacultyGradeSummary
    course_sections: list[GradeCourseSection]
```

```graphql
# GraphQL SDL equivalent

type Query {
  """
  Returns all course sections the authenticated faculty member is
  assigned to, with grade submission status for the given semester.
  If semesterId is omitted, defaults to the current active semester.
  """
  facultyGrades(semesterId: Int): FacultyGradesData!
}

type FacultyGradesData {
  summary: FacultyGradeSummary!
  courseSections: [GradeCourseSection!]!
}

type FacultyGradeSummary {
  totalCourses: Int!
  totalSubmitted: Int!
  totalDraft: Int!
  totalPendingApproval: Int!
  totalApproved: Int!
  totalRejected: Int!
  currentSemesterLabel: String!
}

type GradeCourseSection {
  id: Int!
  subjectCode: String!
  subjectName: String!
  sectionName: String!
  semester: Int!
  semesterLabel: String!
  department: String!
  examType: ExamType!
  examDate: String!
  internalMaxMark: Int!
  externalMaxMark: Int!
  totalMaxMark: Int!
  passMark: Int!
  studentCount: Int!
  submittedCount: Int!
  status: GradeStatus!
  lastModifiedAt: String
  submittedAt: String
}

enum GradeStatus { DRAFT SUBMITTED APPROVED REJECTED }
enum ExamType    { INTERNAL EXTERNAL QUIZ LAB ASSIGNMENT }
```

### Resolver (Strawberry)

```python
# resolvers/faculty_grades.py

from strawberry.types import Info
from django.db.models import Count, Q

@strawberry.type
class Query:
    @strawberry.field
    def faculty_grades(
        self,
        info: Info,
        semester_id: Optional[int] = None,
    ) -> FacultyGradesData:
        faculty_user = info.context.request.user
        # Get faculty profile
        faculty = FacultyProfile.objects.get(user=faculty_user)

        # Determine semester
        if semester_id:
            semester = Semester.objects.get(id=semester_id)
        else:
            semester = Semester.objects.get(is_current=True)

        # Fetch all CourseSection assignments for this faculty
        assignments = CourseSectionAssignment.objects.filter(
            faculty=faculty,
            semester=semester,
        ).select_related('subject', 'section', 'section__department')

        course_sections = []
        total_submitted = total_draft = total_approved = total_rejected = total_pending = 0

        for assignment in assignments:
            grade_batch = GradeBatch.objects.filter(
                course_section_assignment=assignment,
            ).first()

            status = GradeStatus.DRAFT
            submitted_count = 0
            last_modified_at = None
            submitted_at = None

            if grade_batch:
                status = GradeStatus(grade_batch.status)
                submitted_count = grade_batch.grade_entries.exclude(
                    internal_mark=None, external_mark=None
                ).count()
                last_modified_at = grade_batch.updated_at.isoformat() if grade_batch.updated_at else None
                submitted_at = grade_batch.submitted_at.isoformat() if grade_batch.submitted_at else None

            # Accumulate summary counts
            if status == GradeStatus.DRAFT:         total_draft += 1
            elif status == GradeStatus.SUBMITTED:   total_pending += 1
            elif status == GradeStatus.APPROVED:    total_approved += 1
            elif status == GradeStatus.REJECTED:    total_rejected += 1
            total_submitted += (1 if status != GradeStatus.DRAFT else 0)

            internal_max = assignment.exam_config.internal_max_mark
            external_max = assignment.exam_config.external_max_mark

            course_sections.append(GradeCourseSection(
                id=assignment.id,
                subject_code=assignment.subject.code,
                subject_name=assignment.subject.name,
                section_name=assignment.section.name,
                semester=semester.number,
                semester_label=f"Semester {semester.number} — {semester.label}",
                department=assignment.section.department.name,
                exam_type=ExamType(assignment.exam_config.exam_type),
                exam_date=assignment.exam_config.exam_date.isoformat(),
                internal_max_mark=internal_max,
                external_max_mark=external_max,
                total_max_mark=internal_max + external_max,
                pass_mark=assignment.exam_config.pass_mark,
                student_count=assignment.section.student_set.filter(is_active=True).count(),
                submitted_count=submitted_count,
                status=status,
                last_modified_at=last_modified_at,
                submitted_at=submitted_at,
            ))

        summary = FacultyGradeSummary(
            total_courses=len(course_sections),
            total_submitted=total_submitted,
            total_draft=total_draft,
            total_pending_approval=total_pending,
            total_approved=total_approved,
            total_rejected=total_rejected,
            current_semester_label=f"Semester {semester.number} — {semester.label}",
        )

        return FacultyGradesData(summary=summary, course_sections=course_sections)
```

---

## 2. Query: `facultyGradeDetail`

Returns full per-student grade records and aggregate statistics for a specific course section.

### GraphQL Schema

```graphql
type Query {
  """
  Returns the complete grade sheet for a course section assignment —
  including per-student marks, derived grades, and aggregate stats.
  Only accessible by the faculty assigned to this course section.
  """
  facultyGradeDetail(courseSectionId: Int!): FacultyGradeDetailData!
}

type FacultyGradeDetailData {
  courseSection: GradeCourseSection!
  stats: CourseSectionGradeStats!
  students: [StudentGradeRecord!]!
}

type CourseSectionGradeStats {
  totalStudents: Int!
  passCount: Int!
  failCount: Int!
  absentCount: Int!
  passPercentage: Float!
  avgMark: Float!
  highestMark: Float!
  lowestMark: Float!
  gradeDistribution: [GradeDistributionItem!]!
}

type GradeDistributionItem {
  grade: LetterGrade!
  count: Int!
  percentage: Float!
}

type StudentGradeRecord {
  studentId: String!
  registerNumber: String!
  rollNumber: String!
  studentName: String!
  profilePhoto: String   # nullable media URL
  internalMark: Float    # nullable if not yet entered
  externalMark: Float    # nullable if not yet entered
  totalMark: Float       # computed: internal + external
  percentage: Float      # computed: (totalMark / totalMaxMark) * 100
  letterGrade: LetterGrade
  gradePoint: Float      # 0–10
  isPass: Boolean
  isAbsent: Boolean!
}

enum LetterGrade { O A_PLUS A B_PLUS B C F ABSENT WITHHELD }
```

> **Strawberry note for enum values with `+`:** Use `A_PLUS` and `B_PLUS` as Python identifiers, but map them to `"A+"` / `"B+"` in the serialization layer using `strawberry.enum_value`.

```python
@strawberry.enum
class LetterGrade(Enum):
    O        = strawberry.enum_value("O",        description="Outstanding (91-100%)")
    A_PLUS   = strawberry.enum_value("A+",       description="81-90%")
    A        = strawberry.enum_value("A",        description="71-80%")
    B_PLUS   = strawberry.enum_value("B+",       description="61-70%")
    B        = strawberry.enum_value("B",        description="51-60%")
    C        = strawberry.enum_value("C",        description="41-50%")
    F        = strawberry.enum_value("F",        description="Fail < 41%")
    ABSENT   = strawberry.enum_value("ABSENT",   description="Student was absent")
    WITHHELD = strawberry.enum_value("WITHHELD", description="Result withheld")
```

### Resolver

```python
@strawberry.field
def faculty_grade_detail(
    self,
    info: Info,
    course_section_id: int,
) -> FacultyGradeDetailData:
    faculty_user = info.context.request.user
    assignment = CourseSectionAssignment.objects.get(
        id=course_section_id,
        faculty__user=faculty_user,   # ownership check
    )

    students = Student.objects.filter(
        section=assignment.section,
        is_active=True,
    ).select_related('user').order_by('roll_number')

    grade_batch, _ = GradeBatch.objects.get_or_create(
        course_section_assignment=assignment,
        defaults={'status': 'DRAFT'},
    )

    grade_map = {
        ge.student_id: ge
        for ge in GradeEntry.objects.filter(grade_batch=grade_batch)
    }

    internal_max = assignment.exam_config.internal_max_mark
    external_max = assignment.exam_config.external_max_mark
    total_max = internal_max + external_max

    student_records = []
    for student in students:
        ge = grade_map.get(student.id)
        is_absent = ge.is_absent if ge else False
        internal = ge.internal_mark if ge and not is_absent else None
        external = ge.external_mark if ge and not is_absent else None
        total = (internal or 0) + (external or 0) if not is_absent and internal is not None else None
        pct = round((total / total_max) * 100, 2) if total is not None else None
        letter = _derive_letter_grade(pct, is_absent)
        gp = _derive_grade_point(letter)

        student_records.append(StudentGradeRecord(
            student_id=str(student.id),
            register_number=student.register_number,
            roll_number=student.roll_number,
            student_name=student.user.get_full_name(),
            profile_photo=_build_media_url(student.profile_photo, info.context.request),
            internal_mark=internal,
            external_mark=external,
            total_mark=total,
            percentage=pct,
            letter_grade=letter,
            grade_point=gp,
            is_pass=letter not in (LetterGrade.F, LetterGrade.ABSENT, LetterGrade.WITHHELD) if letter else None,
            is_absent=is_absent,
        ))

    stats = _build_grade_stats(student_records, total_max)
    course_section = _build_grade_course_section(assignment, grade_batch)

    return FacultyGradeDetailData(
        course_section=course_section,
        stats=stats,
        students=student_records,
    )

def _derive_letter_grade(pct: float | None, is_absent: bool) -> LetterGrade | None:
    if is_absent: return LetterGrade.ABSENT
    if pct is None: return None
    if pct >= 91: return LetterGrade.O
    if pct >= 81: return LetterGrade.A_PLUS
    if pct >= 71: return LetterGrade.A
    if pct >= 61: return LetterGrade.B_PLUS
    if pct >= 51: return LetterGrade.B
    if pct >= 41: return LetterGrade.C
    return LetterGrade.F

def _derive_grade_point(grade: LetterGrade | None) -> float | None:
    if grade is None: return None
    return {
        LetterGrade.O: 10.0, LetterGrade.A_PLUS: 9.0, LetterGrade.A: 8.0,
        LetterGrade.B_PLUS: 7.0, LetterGrade.B: 6.0, LetterGrade.C: 5.0,
        LetterGrade.F: 0.0, LetterGrade.ABSENT: 0.0, LetterGrade.WITHHELD: 0.0,
    }.get(grade)
```

---

## 3. Mutation: `saveGradesDraft`

Upserts grade entries. Can be called multiple times. Status stays `DRAFT`.

### GraphQL Schema

```graphql
type Mutation {
  """
  Saves or updates grade entries as a draft.
  Idempotent — safe to call multiple times.
  Does NOT change the GradeBatch status (remains DRAFT).
  """
  saveGradesDraft(input: SaveGradesDraftInput!): SaveGradesDraftResult!
}

input SaveGradesDraftInput {
  courseSectionId: Int!
  grades: [StudentGradeInput!]!
}

input StudentGradeInput {
  studentId: String!
  internalMark: Float    # null if absent or not yet entered
  externalMark: Float    # null if absent or not yet entered
  isAbsent: Boolean!
}

type SaveGradesDraftResult {
  success: Boolean!
  message: String!
  updatedAt: String!   # ISO datetime of last modification
}
```

### Resolver

```python
@strawberry.mutation
def save_grades_draft(
    self,
    info: Info,
    input: SaveGradesDraftInput,
) -> SaveGradesDraftResult:
    from django.utils import timezone

    faculty_user = info.context.request.user
    assignment = CourseSectionAssignment.objects.get(
        id=input.course_section_id,
        faculty__user=faculty_user,
    )

    # Only drafts or rejected batches can be edited
    grade_batch, _ = GradeBatch.objects.get_or_create(
        course_section_assignment=assignment,
        defaults={'status': 'DRAFT'},
    )
    if grade_batch.status not in ('DRAFT', 'REJECTED'):
        raise ValueError("Cannot edit a grade batch that is SUBMITTED or APPROVED.")

    for grade_input in input.grades:
        GradeEntry.objects.update_or_create(
            grade_batch=grade_batch,
            student_id=int(grade_input.student_id),
            defaults={
                'internal_mark': None if grade_input.is_absent else grade_input.internal_mark,
                'external_mark': None if grade_input.is_absent else grade_input.external_mark,
                'is_absent': grade_input.is_absent,
            },
        )

    grade_batch.updated_at = timezone.now()
    grade_batch.save(update_fields=['updated_at'])

    return SaveGradesDraftResult(
        success=True,
        message="Draft saved successfully.",
        updated_at=grade_batch.updated_at.isoformat(),
    )
```

---

## 4. Mutation: `submitGrades`

Finalises the grade batch and moves it to `SUBMITTED` for HOD approval.

### GraphQL Schema

```graphql
type Mutation {
  """
  Submits the grade batch for HOD/admin approval.
  After submission, the faculty cannot edit until the batch is rejected.
  All student grades must have marks entered (or marked absent) before submission.
  """
  submitGrades(input: SubmitGradesInput!): SubmitGradesResult!
}

input SubmitGradesInput {
  courseSectionId: Int!
  grades: [StudentGradeInput!]!   # Final state of all grades
}

type SubmitGradesResult {
  success: Boolean!
  message: String!
  submittedAt: String!   # ISO datetime
  status: GradeStatus!   # Will be SUBMITTED on success
}
```

### Resolver

```python
@strawberry.mutation
def submit_grades(
    self,
    info: Info,
    input: SubmitGradesInput,
) -> SubmitGradesResult:
    from django.utils import timezone

    faculty_user = info.context.request.user
    assignment = CourseSectionAssignment.objects.get(
        id=input.course_section_id,
        faculty__user=faculty_user,
    )

    grade_batch, _ = GradeBatch.objects.get_or_create(
        course_section_assignment=assignment,
        defaults={'status': 'DRAFT'},
    )

    if grade_batch.status not in ('DRAFT', 'REJECTED'):
        raise ValueError("Grades are already submitted or approved.")

    # Upsert all grade entries (same logic as saveGradesDraft)
    for grade_input in input.grades:
        GradeEntry.objects.update_or_create(
            grade_batch=grade_batch,
            student_id=int(grade_input.student_id),
            defaults={
                'internal_mark': None if grade_input.is_absent else grade_input.internal_mark,
                'external_mark': None if grade_input.is_absent else grade_input.external_mark,
                'is_absent': grade_input.is_absent,
            },
        )

    # Validation: all students must have marks or be marked absent
    total_students = assignment.section.student_set.filter(is_active=True).count()
    complete_entries = GradeEntry.objects.filter(
        grade_batch=grade_batch,
    ).filter(
        Q(is_absent=True) |
        Q(internal_mark__isnull=False, external_mark__isnull=False)
    ).count()

    if complete_entries < total_students:
        raise ValueError(
            f"All {total_students} students must have marks entered or be marked absent before submission. "
            f"Only {complete_entries} are complete."
        )

    now = timezone.now()
    grade_batch.status = 'SUBMITTED'
    grade_batch.submitted_at = now
    grade_batch.updated_at = now
    grade_batch.save(update_fields=['status', 'submitted_at', 'updated_at'])

    # TODO: Send notification to HOD about new grade submission
    # notify_hod_grade_submission(assignment, grade_batch)

    return SubmitGradesResult(
        success=True,
        message="Grades submitted successfully and sent for approval.",
        submitted_at=now.isoformat(),
        status=GradeStatus.SUBMITTED,
    )
```

---

## 5. Django Model Reference

The resolvers above assume the following Django model structure. Adapt field names to match your actual schema.

```python
# models.py (simplified)

class GradeBatch(models.Model):
    """One per (CourseSection Assignment + ExamType). Tracks submission lifecycle."""
    course_section_assignment = models.OneToOneField(
        'CourseSectionAssignment', on_delete=models.CASCADE, related_name='grade_batch'
    )
    status = models.CharField(
        max_length=20,
        choices=[('DRAFT','Draft'),('SUBMITTED','Submitted'),('APPROVED','Approved'),('REJECTED','Rejected')],
        default='DRAFT',
    )
    submitted_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    rejection_reason = models.TextField(blank=True)

class GradeEntry(models.Model):
    """One per (GradeBatch + Student). Stores raw marks; grades are derived."""
    grade_batch = models.ForeignKey(GradeBatch, on_delete=models.CASCADE, related_name='grade_entries')
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    internal_mark = models.FloatField(null=True, blank=True)
    external_mark = models.FloatField(null=True, blank=True)
    is_absent = models.BooleanField(default=False)

    # Derived fields — computed and stored after submission for performance
    total_mark = models.FloatField(null=True, blank=True)
    percentage = models.FloatField(null=True, blank=True)
    letter_grade = models.CharField(max_length=10, blank=True)
    grade_point = models.FloatField(null=True, blank=True)
    is_pass = models.BooleanField(null=True)

    class Meta:
        unique_together = [('grade_batch', 'student')]
```

---

## 6. Authentication & Authorization

| Endpoint | Auth Required | Ownership Check |
|---|---|---|
| `facultyGrades` | ✅ JWT Bearer | Filter by `faculty.user == request.user` |
| `facultyGradeDetail` | ✅ JWT Bearer | `CourseSectionAssignment.faculty.user == request.user` |
| `saveGradesDraft` | ✅ JWT Bearer | Same ownership check |
| `submitGrades` | ✅ JWT Bearer | Same ownership check |

All mutations must raise `PermissionDenied` if the authenticated user does not own the course section assignment.

---

## 7. Error Handling Expectations

The frontend expects Strawberry errors to be returned as GraphQL errors (not HTTP 4xx). Use `strawberry.exceptions` or raise standard Python exceptions — Strawberry will serialize them.

Common error cases the frontend handles:

| Scenario | Expected Error Message |
|---|---|
| Course section not found / not owned | `"Course section not found or access denied."` |
| Submit without all grades complete | `"All N students must have marks entered or be marked absent before submission."` |
| Editing a non-draft batch | `"Cannot edit a grade batch that is SUBMITTED or APPROVED."` |

---

## 8. Frontend ↔ Backend Field Name Mapping

Strawberry auto-converts Python `snake_case` to GraphQL `camelCase`. The frontend TypeScript types use `camelCase` matching the GraphQL output.

| Python (Strawberry) | GraphQL / TypeScript |
|---|---|
| `course_section_id` | `courseSectionId` |
| `internal_max_mark` | `internalMaxMark` |
| `external_max_mark` | `externalMaxMark` |
| `total_max_mark` | `totalMaxMark` |
| `pass_mark` | `passMark` |
| `student_count` | `studentCount` |
| `submitted_count` | `submittedCount` |
| `last_modified_at` | `lastModifiedAt` |
| `submitted_at` | `submittedAt` |
| `letter_grade` | `letterGrade` |
| `grade_point` | `gradePoint` |
| `is_pass` | `isPass` |
| `is_absent` | `isAbsent` |
| `register_number` | `registerNumber` |
| `roll_number` | `rollNumber` |
| `student_name` | `studentName` |
| `profile_photo` | `profilePhoto` |
| `grade_distribution` | `gradeDistribution` |
| `pass_count` | `passCount` |
| `fail_count` | `failCount` |
| `absent_count` | `absentCount` |
| `pass_percentage` | `passPercentage` |
| `avg_mark` | `avgMark` |
| `highest_mark` | `highestMark` |
| `lowest_mark` | `lowestMark` |
| `total_courses` | `totalCourses` |
| `total_submitted` | `totalSubmitted` |
| `total_draft` | `totalDraft` |
| `total_pending_approval` | `totalPendingApproval` |
| `total_approved` | `totalApproved` |
| `total_rejected` | `totalRejected` |
| `current_semester_label` | `currentSemesterLabel` |
| `semester_label` | `semesterLabel` |
| `exam_type` | `examType` |
| `exam_date` | `examDate` |
| `course_sections` | `courseSections` |

---

## 9. HOD Approval Flow (for Reference)

When the frontend submits grades, the backend should also support:

```graphql
# HOD-side mutations (out of scope for this ticket, but needed for the full flow)

type Mutation {
  approveGrades(gradeBatchId: Int!): ApproveGradesResult!
  rejectGrades(gradeBatchId: Int!, reason: String!): RejectGradesResult!
}
```

After **approval**, the `GradeEntry.letter_grade`, `.grade_point`, `.is_pass` fields should be frozen/persisted.  
After **rejection**, the `GradeBatch.status` goes back to `REJECTED` and the faculty can re-edit.

---

## 10. Frontend Integration Checklist

- [ ] `facultyGrades` query returns data with correct `camelCase` field names
- [ ] `facultyGradeDetail` returns all student records with derived `letterGrade` and `gradePoint`
- [ ] `saveGradesDraft` mutation succeeds and returns `updatedAt`
- [ ] `submitGrades` mutation validates completeness and returns `status: SUBMITTED`
- [ ] Ownership checks prevent one faculty from viewing/editing another's course sections
- [ ] Media URL for `profilePhoto` is a complete URL (e.g., `http://server/media/...`) or `null`
- [ ] Enum values match exactly: `"O"`, `"A+"`, `"B+"`, `"ABSENT"`, etc.
- [ ] `currentSemesterLabel` format: `"Semester V — Jan–May 2026"`
