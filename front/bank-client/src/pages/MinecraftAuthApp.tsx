import React, { useState } from 'react';
import { User, Lock, Gamepad2, Zap, Shield, Router } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const RegisterPage = ({ registerData, setRegisterData, handleRegister, isLoading, message, setCurrentPage }) => (
   <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-800 via-blue-600 to-cyan-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dr. Doofenshmirtz themed background */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-12 h-12 bg-orange-400 transform rotate-45 animate-pulse"></div>
        <div className="absolute top-32 right-12 w-8 h-8 bg-pink-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-24 left-24 w-6 h-6 bg-yellow-300 animate-ping"></div>
        <div className="absolute bottom-16 right-16 w-10 h-10 bg-green-400 rotate-12 animate-spin"></div>
        <div className="absolute top-1/2 left-8 w-4 h-16 bg-red-500 animate-pulse"></div>
      </div>

      <div className="bg-slate-800 border-8 border-purple-600 rounded-none shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-purple-400 mr-2" size={32} />
            <h1 className="text-3xl font-bold text-white font-mono">
              РЕГИСТРАЦИЯ
            </h1>
            <Zap className="text-cyan-400 ml-2 animate-pulse" size={32} />
          </div>
          <p className="text-gray-300 font-mono text-sm">
            Создайте свой аккаунт!
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-purple-400 font-mono text-sm font-bold mb-2">
              Имя пользователя (желательно как в майне)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full pl-12 pr-4 py-3 bg-slate-700 border-4 border-slate-500 text-white font-mono placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Выберите крутой никнейм"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-400 font-mono text-sm font-bold mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-slate-700 border-4 border-slate-500 text-white font-mono placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Придумайте надёжный пароль"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-400 font-mono text-sm font-bold mb-2">
              ПОДТВЕРЖДЕНИЕ
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-slate-700 border-4 border-slate-500 text-white font-mono placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Повторите пароль"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono py-4 px-4 border-4 border-purple-800 hover:border-purple-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? 'СОЗДАНИЕ...' : 'СОЗДАТЬ АККАУНТ! 🚀'}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 border-4 font-mono text-sm ${
            message.includes('создан') 
              ? 'bg-green-800 border-green-600 text-green-200' 
              : 'bg-red-800 border-red-600 text-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-300 font-mono text-sm mb-2">
            Уже есть аккаунт?
          </p>
          <button
            onClick={() => setCurrentPage('login')}
            className="text-cyan-400 hover:text-cyan-300 font-mono font-bold underline transition-colors"
          >
            ВЕРНУТЬСЯ КО ВХОДУ
          </button>
        </div>
      </div>
    </div>
);

const LoginPage = ({ loginData, setLoginData, handleLogin, isLoading, message, setCurrentPage }) => (
 <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-green-800 via-green-600 to-emerald-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-8 h-8 bg-yellow-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-red-500 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 bg-blue-400 rotate-12 animate-spin"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-purple-500 animate-ping"></div>
      </div>
      
      <div className="bg-stone-800 border-8 border-stone-600 rounded-none shadow-2xl p-8 w-full max-w-md relative z-10">
        {/* Minecraft-style header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gamepad2 className="text-green-400 mr-2" size={32} />
            <h1 className="text-3xl font-bold text-white font-mono">
              ВХОД В СИСТЕМУ
            </h1>
            <Zap className="text-yellow-400 ml-2" size={32} />
          </div>
          <p className="text-gray-300 font-mono text-sm">
            Добро пожаловать в мир приключений!
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-green-400 font-mono text-sm font-bold mb-2">
              Имя пользователя
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 bg-stone-700 border-4 border-stone-500 text-white font-mono placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
                placeholder="Введите ваш никнейм"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-green-400 font-mono text-sm font-bold mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-stone-700 border-4 border-stone-500 text-white font-mono placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
                placeholder="Введите пароль"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold font-mono py-4 px-4 border-4 border-green-800 hover:border-green-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? 'ЗАГРУЗКА...' : 'ВОЙТИ В ИГРУ 🎮'}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 border-4 font-mono text-sm ${
            message.includes('Добро пожаловать') 
              ? 'bg-green-800 border-green-600 text-green-200' 
              : 'bg-red-800 border-red-600 text-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-300 font-mono text-sm mb-2">
            Нет аккаунта?
          </p>
          <button
            onClick={() => setCurrentPage('register')}
            className="text-yellow-400 hover:text-yellow-300 font-mono font-bold underline transition-colors"
          >
            СОЗДАТЬ НОВЫЙ ПРОФИЛЬ
          </button>
        </div>
      </div>
    </div>
);

const MinecraftAuthApp = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('https://fufelschmerz-filth-inc-1.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Добро пожаловать в мир! 🎮');
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        setMessage(data.error || 'Ошибка входа');
      }
    } catch (error) {
      setMessage('Ошибка подключения к серверу');
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setMessage('Пароли не совпадают!');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('https://fufelschmerz-filth-inc-1.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Аккаунт создан! Теперь можете войти 🎉');
        setCurrentPage('login');
      } else {
        setMessage(data.error || 'Ошибка регистрации');
      }
    } catch (error) {
      setMessage('Ошибка подключения к серверу');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      {currentPage === 'login' ? (
        <LoginPage
          loginData={loginData}
          setLoginData={setLoginData}
          handleLogin={handleLogin}
          isLoading={isLoading}
          message={message}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <RegisterPage
          registerData={registerData}
          setRegisterData={setRegisterData}
          handleRegister={handleRegister}
          isLoading={isLoading}
          message={message}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MinecraftAuthApp;