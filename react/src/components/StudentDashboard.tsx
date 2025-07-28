import React, { useEffect, useState } from "react";
// @ts-ignore
import styles from "./StudentDashboard.module.css";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor?: {
    id: string;
    email: string;
  };
}

interface RatingState {
  [courseId: string]: number;
}

const StudentDashboard: React.FC = () => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // for per-action loading
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<RatingState>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  // Fetch all courses (for enrollment)
  useEffect(() => {
    fetch("http://localhost:3000/api/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAvailableCourses(data));
  }, [token]);

  // Fetch enrolled courses
  const fetchEnrolled = () => {
    fetch("http://localhost:3000/api/enrollments/my-courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEnrolledCourses(data));
  };

  useEffect(() => {
    fetchEnrolled();
    // Fetch ratings after enrolled courses are loaded
    fetch("http://localhost:3000/api/ratings/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const ratingsObj: RatingState = {};
        data.forEach((r: { courseId: string; value: number }) => {
          ratingsObj[r.courseId] = r.value;
        });
        setRatings(ratingsObj);
      });
  }, [token]);

  // Enroll in a course
  const handleEnroll = async (courseId: string) => {
    setActionLoading(courseId);
    await fetch("http://localhost:3000/api/enrollments/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId }),
    });
    setActionLoading(null);
    setFeedback("Enrolled successfully!");
    setTimeout(() => setFeedback(null), 2000);
    fetchEnrolled();
  };

  // Withdraw from a course
  const handleWithdraw = async (courseId: string) => {
    setActionLoading(courseId);
    await fetch("http://localhost:3000/api/enrollments/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId }),
    });
    setActionLoading(null);
    setFeedback("Withdrawn from course.");
    setTimeout(() => setFeedback(null), 2000);
    fetchEnrolled();
  };

  // Handle rating (optimistic update)
  const handleRate = async (courseId: string, value: number) => {
    setRatings((prev) => ({ ...prev, [courseId]: value }));
    await fetch(`http://localhost:3000/api/ratings/rate/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value }),
    });
    setFeedback("Rating submitted!");
    setTimeout(() => setFeedback(null), 2000);
  };

  // Filter out already enrolled courses from available
  const notEnrolledCourses = availableCourses.filter(
    (c) => !enrolledCourses.some((ec) => ec.id === c.id)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Student Dashboard</h1>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
      {/* Feedback/Toast */}
      {feedback && (
        <div className={styles.toast}>{feedback}</div>
      )}
      {/* Loading Spinner */}
      {loading && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      )}
      {/* Enrolled Courses */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Enrolled Courses</h2>
        <div className={styles.grid}>
          {enrolledCourses.length === 0 && (
            <div className={styles.emptyText}>No enrolled courses.</div>
          )}
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>{course.title}</div>
                  <div className={styles.cardDescription}>{course.description}</div>
                  {course.instructor && (
                    <div className={styles.instructor}>
                      Instructor: {course.instructor.email}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleWithdraw(course.id)}
                  disabled={actionLoading === course.id}
                  className={
                    actionLoading === course.id
                      ? `${styles.button} ${styles.dangerButton} ${styles.disabledButton}`
                      : `${styles.button} ${styles.dangerButton}`
                  }
                >
                  {actionLoading === course.id ? '...' : 'Withdraw'}
                </button>
              </div>
              {/* Rating Stars */}
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(course.id, star)}
                    className={styles.starButton}
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <span
                      className={
                        (ratings[course.id] || 0) >= star
                          ? styles.starActive
                          : styles.starInactive
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Available Courses */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Available Courses</h2>
        <div className={styles.grid}>
          {notEnrolledCourses.length === 0 && (
            <div className={styles.emptyText}>No available courses to enroll.</div>
          )}
          {notEnrolledCourses.map((course) => (
            <div
              key={course.id}
              className={styles.card}
            >
              <div className={styles.cardTitle}>{course.title}</div>
              <div className={styles.cardDescription}>{course.description}</div>
              <button
                onClick={() => handleEnroll(course.id)}
                disabled={actionLoading === course.id}
                className={
                  actionLoading === course.id
                    ? `${styles.button} ${styles.primaryButton} ${styles.disabledButton}`
                    : `${styles.button} ${styles.primaryButton}`
                }
              >
                {actionLoading === course.id ? '...' : 'Enroll'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
