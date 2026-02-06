import { useEffect, useState } from 'react';
import { getStudents } from './api';
import type { Student } from './types';

export const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudents()
            .then(res => setStudents(res.data))
            .finally(() => setLoading(false));
    }, []);

    return { students, loading };
};
