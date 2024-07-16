import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Input from './Input';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = { email, password };
    const notify = toast.loading('Processing...');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login-or-signup', data, { withCredentials: true });
      sessionStorage.setItem('token', response.data.token);
      toast.dismiss(notify);
      toast.success(response.data.message);
      navigate('/home');
    } catch (error: any) {
      toast.dismiss(notify);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className='min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-bold text-gray-900'>Sign in to your account</h2>
        </div>
        <form className='mt-8 space-y-3' onSubmit={handleSubmit}>
          <div className='flex flex-col items-center justify-center'>
            <Input id='email' type='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)} />
            <Input id='password' type='password' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <div className='flex items-center justify-center'>
            <button
              type='submit'
              className='group relative w-5/6 flex justify-center text-lg py-5 px-4 rounded-lg border border-transparent text-sm font-medium text-white bg-green-500 hover:bg-green-700'
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
