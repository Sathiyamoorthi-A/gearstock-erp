import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCog6Tooth } from 'react-icons/hi2';
import { FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.card}>
        <div className={styles.branding}>
          <div className={styles.logoIcon}>
            <HiCog6Tooth />
          </div>
          <h1 className={styles.title}>GearStock ERP PRO</h1>
          <p className={styles.subtitle}>Hardware Store Management System</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error}>
              <FiAlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              id="username"
              className={styles.input}
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            <span className={styles.buttonContent}>
              {isLoading && <span className={styles.spinner} />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </span>
          </button>
        </form>

        <p className={styles.footer}>
          © 2026 GearStock ERP PRO. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
