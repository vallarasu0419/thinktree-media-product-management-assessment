import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './Auth.module.css';
import { useAuth } from '../context/AuthContext';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import { getPasswordError } from '../utils/validators';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state && location.state.from ? location.state.from : '/admin';

  const [form, setForm] = useState({ email: 'admin@example.com', password: 'Admin@123' });
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
    if (!form.email.trim()) next.email = 'Email is required';
    const passwordError = getPasswordError(form.password);
    if (passwordError) next.password = passwordError;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await login(form.email.trim(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        (err.response && err.response.data && err.response.data.message) ||
        'Unable to log in. Please try again.';
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
            <i className="fa-solid fa-cube" aria-hidden="true" />
          </span>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to manage your products</p>
        </div>

        {apiError && (
          <div className={styles.alert}>
            <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
            {apiError}
          </div>
        )}

        <form className={styles.form} onSubmit={onSubmit} noValidate>
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
            placeholder="••••••••"
            error={errors.password}
            icon="fa-solid fa-lock"
            required
          />
          <CustomButton type="submit" block size="lg" loading={loading} icon="fa-solid fa-right-to-bracket">
            Sign in
          </CustomButton>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
