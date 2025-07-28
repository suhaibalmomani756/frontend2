import React from 'react';
import loginImg from '../assets/login.jpg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import SignupSchema from '../validation/signupSchema';

interface SignupFormValues {
  email: string;
  password: string;
  role: 'STUDENT' | 'INSTRUCTOR';
}

const Signup: React.FC = () => {
  const initialValues: SignupFormValues = {
    email: '',
    password: '',
    role: 'STUDENT',
  };

  const handleSubmit = async (values: SignupFormValues, { setSubmitting, resetForm }: any) => {
    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Signup successful!');
        resetForm();
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-grid">
      <div className="app-img">
        <img src={loginImg} alt="" />
      </div>
      <div className="form-container">
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="form-box">
              <h2 className="form-title">SIGN UP</h2>
              <div className="form-group">
                <label>Email</label>
                <Field type="email" name="email" />
                <div className="form-error"><ErrorMessage name="email" /></div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <Field type="password" name="password" />
                <div className="form-error"><ErrorMessage name="password" /></div>
              </div>
              <div className="form-group">
                <label>Role</label>
                <Field as="select" name="role">
                  <option value="STUDENT">Student</option>
                  <option value="INSTRUCTOR">Instructor</option>
                </Field>
                <div className="form-error"><ErrorMessage name="role" /></div>
              </div>
              <button className="form-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'SIGNUP'}
              </button>
              <p className="form-footer">Already have an account? <a href="/" className="form-link">Sign in</a></p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup; 