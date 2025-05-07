import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, LogIn, Sofa } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ auth: error.message });
      setIsLoading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'flex items-center justify-center min-h-screen', style: { backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url("/images/backgorund.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } },
    React.createElement(
      'div',
      { className: 'w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl' },
      React.createElement(
        'div',
        { className: 'text-center' },
        React.createElement(Sofa, { className: 'w-12 h-12 text-blue-600 mx-auto' }),
        React.createElement('h2', { className: 'mt-4 text-3xl font-bold text-gray-800' }, 'Furniture Designer'),
        React.createElement('p', { className: 'mt-2 text-gray-600' }, 'Sign in to your account')
      ),
      React.createElement(
        'form',
        { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
        React.createElement(
          'div',
          { className: 'space-y-4' },
          React.createElement(
            'div',
            null,
            React.createElement('label', { htmlFor: 'email', className: 'block text-sm font-medium text-gray-700' }, 'Email'),
            React.createElement('input', {
              id: 'email',
              type: 'email',
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: `mt-1 block w-full px-4 py-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`,
              placeholder: 'Enter your email'
            }),
            errors.email && React.createElement('p', { className: 'mt-1 text-sm text-red-600' }, errors.email)
          ),
          React.createElement(
            'div',
            null,
            React.createElement('label', { htmlFor: 'password', className: 'block text-sm font-medium text-gray-700' }, 'Password'),
            React.createElement(
              'div',
              { className: 'relative mt-1' },
              React.createElement('input', {
                id: 'password',
                type: showPassword ? 'text' : 'password',
                value: password,
                onChange: (e) => setPassword(e.target.value),
                className: `block w-full px-4 py-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`,
                placeholder: 'Enter your password'
              }),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => setShowPassword(!showPassword),
                  className: 'absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500'
                },
                showPassword ? React.createElement(EyeOff, { className: 'w-5 h-5' }) : React.createElement(Eye, { className: 'w-5 h-5' })
              )
            ),
            errors.password && React.createElement('p', { className: 'mt-1 text-sm text-red-600' }, errors.password)
          ),
          errors.auth && React.createElement('p', { className: 'text-sm text-red-600' }, errors.auth)
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: isLoading,
              className: `group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white ${
                isLoading ? 'bg-yellow-900/60' : 'bg-yellow-900 hover:bg-yellow-800'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-900 font-medium`
            },
            React.createElement(LogIn, { className: 'w-5 h-5 text-blue-200 absolute left-3 top-3' }),
            isLoading ? 'Signing in...' : 'Sign in'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'text-center mt-4' },
        React.createElement(
          'p',
          { className: 'text-sm text-gray-600' },
          'Don’t have an account? ',
          React.createElement(
            'a',
            { href: '/register', className: 'text-blue-600 hover:text-blue-800' },
            'Register here'
          )
        )
      )
    )
  );
};

export default Login;