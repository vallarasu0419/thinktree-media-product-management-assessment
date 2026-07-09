import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import { getPasswordError } from '../utils/validators';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    const passwordError = getPasswordError(form.password);
    if (passwordError) next.password = passwordError;
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      const msg =
        (err.response && err.response.data && err.response.data.message) ||
        'Unable to register. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>
            <i className="fa-solid fa-user-plus" aria-hidden="true" />
          </span>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Register a new account</p>
        </div>

        {apiError && (
          <div className={styles.alert}>
            <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
            {apiError}
          </div>
        )}

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <CustomInput
            label="Full name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Jane Doe"
            error={errors.name}
            icon="fa-solid fa-user"
            required
          />
          <CustomInput
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            error={errors.email}
            icon="fa-solid fa-envelope"
            required
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Create a password"
            error={errors.password}
            icon="fa-solid fa-lock"
            required
          />
          <CustomInput
            label="Confirm password"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={onChange}
            placeholder="Re-enter password"
            error={errors.confirm}
            icon="fa-solid fa-lock"
            required
          />
          <CustomButton type="submit" block size="lg" loading={loading} icon="fa-solid fa-user-plus">
            Create account
          </CustomButton>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
