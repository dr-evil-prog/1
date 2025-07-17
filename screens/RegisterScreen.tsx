import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { register, t } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, password);
    setMessage(t('register.successMessage'));
    setTimeout(() => {
        navigate('/login');
    }, 4000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen -mt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          {t('register.title')}
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
              {message}
            </div>
          )}
           <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700 sr-only">{t('register.namePlaceholder')}</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder={t('register.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email-register" className="text-sm font-medium text-gray-700 sr-only">{t('register.emailPlaceholder')}</label>
            <input
              id="email-register"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder={t('register.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password-register" className="sr-only text-sm font-medium text-gray-700">{t('register.passwordPlaceholder')}</label>
            <input
              id="password-register"
              name="password"
              type="password"
              required
              className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder={t('register.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={!!message}
            >
              {t('register.registerButton')}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          {t('register.alreadyMember')}{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-500">
            {t('register.signInHere')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
