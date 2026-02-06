import { useStudents } from '../hooks';

export function StudentList() {
    const { students, loading } = useStudents();

    if (loading) return <div>Loading...</div>;

    return (
        <ul className="space-y-2">
            {students.map(student => (
                <li key={student.id} className="p-4 border rounded shadow-sm">
                    {student.firstName} {student.lastName}
                </li>
            ))}
        </ul>
    );
}
