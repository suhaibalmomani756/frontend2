import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  role: Yup.string().oneOf(['STUDENT', 'INSTRUCTOR'], 'Select a role').required('Required'),
});

export default SignupSchema; 