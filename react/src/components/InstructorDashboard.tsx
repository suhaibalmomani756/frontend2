import React, { useEffect, useState } from 'react';
// @ts-ignore
import styles from './InstructorDashboard.module.css';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Student {
  id: string;
  email: string;
  rating: number | null;
}

const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const [studentsByCourse, setStudentsByCourse] = useState<{ [courseId: string]: Student[] }>({});
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>([]); // NEW
  const navigate = useNavigate();

  // Fetch instructor's courses
  const fetchCourses = () => {
    fetch('http://localhost:3000/api/courses/instructor/my-courses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCourses(data));
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  // Create a course
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('http://localhost:3000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    setTitle('');
    setDescription('');
    setLoading(false);
    fetchCourses();
  };

  // Delete a course
  const handleDelete = async (id: string) => {
    // Check if students are loaded, otherwise fetch them first
    let students = studentsByCourse[id];
    if (students === undefined) {
      await fetchStudents(id);
      students = studentsByCourse[id];
    }
    if (Array.isArray(students) && students.length > 0) {
      window.alert('Cannot delete: there are students enrolled in this course.');
      return;
    }
    setLoading(true);
    await fetch(`http://localhost:3000/api/courses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoading(false);
    fetchCourses();
  };

  // Fetch enrolled students for a course
  const fetchStudents = async (courseId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/enrollments/course/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudentsByCourse(prev => ({ ...prev, [courseId]: Array.isArray(data) ? data : [] }));
    } catch (err) {
      setStudentsByCourse(prev => ({ ...prev, [courseId]: [] }));
    }
  };

  // Toggle enrolled students for a course
  const handleToggleStudents = async (courseId: string) => {
    if (expandedCourseIds.includes(courseId)) {
      setExpandedCourseIds(expandedCourseIds.filter(id => id !== courseId));
    } else {
      // Only fetch if not already loaded
      if (!studentsByCourse[courseId]) {
        await fetchStudents(courseId);
      }
      setExpandedCourseIds([...expandedCourseIds, courseId]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Instructor Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
      <form onSubmit={handleCreate} className={styles.form}>
        <h2 className={styles.sectionTitle}>Create Course</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={loading} className={styles.button + ' ' + styles.primaryButton + (loading ? ' ' + styles.disabledButton : '')}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My Courses</h2>
        <div className={styles.grid}>
          {courses.length === 0 && <div className={styles.emptyText}>No courses created yet.</div>}
          {courses.map(course => (
            <div key={course.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>{course.title}</div>
                  <div className={styles.cardDescription}>{course.description}</div>
                </div>
                <div>
                  <button onClick={() => handleDelete(course.id)} disabled={loading} className={styles.button + ' ' + styles.dangerButton + (loading ? ' ' + styles.disabledButton : '')}>
                    Delete
                  </button>
                  <button onClick={() => handleToggleStudents(course.id)} className={styles.button + ' ' + styles.secondaryButton}>
                    {expandedCourseIds.includes(course.id) ? 'Hide Enrolled Students' : 'Show Enrolled Students'}
                  </button>
                </div>
              </div>
              {expandedCourseIds.includes(course.id) && Array.isArray(studentsByCourse[course.id]) && studentsByCourse[course.id] && (
                <ul className={styles.studentsList}>
                  {studentsByCourse[course.id].length === 0 && <li className={styles.emptyText}>No students enrolled.</li>}
                  {studentsByCourse[course.id].map(student => (
                    <li key={student.id} className={styles.studentItem}>
                      {student.email}
                      <span className={styles.stars}>
                        {[1,2,3,4,5].map(star => (
                          <span
                            key={star}
                            className={(student.rating || 0) >= star ? styles.starActive : styles.starInactive}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InstructorDashboard; 