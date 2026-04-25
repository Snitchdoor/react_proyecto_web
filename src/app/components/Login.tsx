import { useState } from 'react';
import { useAuth } from './AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsClient } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Invalid credentials');
      setPassword('');
    }
  };

  const handleClientLogin = () => {
    loginAsClient();
  };

  return (
    <div className="h-screen w-full bg-[#fafafa] flex items-center justify-center px-4">
      <div className="w-full max-w-[340px]">
        <div className="mb-12 text-center">
          <h1 className="text-[32px] tracking-tight text-[#1a1a1a] mb-2">Coreiu</h1>
          <p className="text-[14px] text-[#737373]">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-white border border-[#e5e5e5] rounded-md text-[14px] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#002FA7] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-white border border-[#e5e5e5] rounded-md text-[14px] placeholder:text-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#002FA7] focus:border-transparent transition-all"
            />
          </div>

          {error && (
            <p className="text-[12px] text-[#dc2626] text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#002FA7] text-white rounded-md text-[14px] hover:bg-[#002080] transition-colors"
          >
            Sign In
          </button>
          
          <button
            type="button"
            onClick={handleClientLogin}
            className="w-full py-3 bg-white border border-[#002FA7] text-[#002FA7] rounded-md text-[14px] hover:bg-[#f0f4ff] transition-colors"
          >
            Soy Cliente
          </button>
        </form>

        <p className="mt-8 text-[12px] text-[#a3a3a3] text-center">
          Demo: admin/1234 or repartidor/1234
        </p>
      </div>
    </div>
  );
}