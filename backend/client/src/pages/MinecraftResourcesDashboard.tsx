import React, { useState, useEffect, useCallback } from 'react';
import { Package, Send, TrendingUp, Search, User, ArrowRight, RefreshCw, History, Gamepad2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';


const TransferTab = ({
  userSearch, setUserSearch,
  userSearchResults,
  transferData, setTransferData,
  resourceSearchResults,
  handleTransfer,
  loading
  }) => {
   return (<div className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-mono flex items-center">
        <Send className="mr-2 text-purple-400" />
        ПЕРЕВОД РЕСУРСОВ
      </h2>

      <div className="bg-slate-700 border-4 border-purple-500 p-6 space-y-6">
        {/* Recipient search */}
        <div>
          <label className="block text-purple-400 font-mono text-sm font-bold mb-2">
            ПОЛУЧАТЕЛЬ
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-600 border-4 border-slate-400 text-white font-mono placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
              placeholder="Найдите пользователя"
            />
          </div>
          {userSearchResults.length > 0 && userSearch && (
            <div className="mt-2 bg-slate-600 border-4 border-slate-400 max-h-40 overflow-y-auto">
              {userSearchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setTransferData({...transferData, receiverName: user.username});
                    setUserSearch(user.username);
                    setUserSearchResults([]);
                  }}
                  className="p-3 hover:bg-slate-500 cursor-pointer text-white font-mono border-b border-slate-500 last:border-b-0"
                >
                  {user.username}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected recipient display */}
        {transferData.receiverName && (
          <div className="bg-green-800 border-2 border-green-600 p-3 rounded">
            <span className="text-green-200 font-mono text-sm">Выбран получатель: </span>
            <span className="text-white font-mono font-bold">{transferData.receiverName}</span>
            <button
              onClick={() => {
                setTransferData({...transferData, receiverName: ''});
                setUserSearch('');
              }}
              className="ml-2 text-red-400 hover:text-red-300 font-mono text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Resource selection */}
        <div>
          <label className="block text-purple-400 font-mono text-sm font-bold mb-2">
            РЕСУРС
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-3 text-gray-400" size={20} />
            <select
              value={transferData.resourceName}
              onChange={(e) => setTransferData({...transferData, resourceName: e.target.value})}
              className="w-full pl-12 pr-4 py-3 bg-slate-600 border-4 border-slate-400 text-white font-mono focus:border-purple-400 focus:outline-none transition-colors"
            >
              <option value="">Выберите ресурс</option>
              {resourceSearchResults.map((resource) => (
                <option key={resource.id} value={resource.name}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-purple-400 font-mono text-sm font-bold mb-2">
            КОЛИЧЕСТВО
          </label>
          <input
            type="number"
            value={transferData.quantity}
            onChange={(e) => setTransferData({...transferData, quantity: e.target.value})}
            className="w-full py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
            placeholder="Введите количество"
            min="1"
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono py-4 px-4 border-4 border-purple-800 hover:border-purple-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
        >
          {loading ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ РЕСУРСЫ 🚀'}
        </button>
      </div>
    </div>
  )};

const MinecraftResourcesDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');
  const [userResources, setUserResources] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('user')

  // Transfer form data
  const [transferData, setTransferData] = useState({
    receiverName: '',
    resourceName: '',
    quantity: ''
  });

  useEffect(()=>{
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const payloadBase64 = token.split('.')[1]; // Вытаскиваем payload (вторая часть токена)
            const payloadJson = atob(payloadBase64); // Декодируем из base64
            const payload = JSON.parse(payloadJson); // Парсим JSON
            setRole(payload.role)
        }
    } catch (error) {
        
    }
    
  }, [])

  

  // Search states - разделяем состояния поиска и формы
  const [userSearch, setUserSearch] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceSearchResults, setResourceSearchResults] = useState([]);

  // Exchange rate history
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState({ from: '', to: '' });

  // Fetch user resources
  const fetchUserResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/users/resources', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      // Confirm structure and extract array if needed
      const resourcesArray = Array.isArray(data)
        ? data
        : data.resources || [];

      setUserResources(resourcesArray);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setUserResources([]); // fallback to prevent .map crash
    }
  };

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/exchange-rates');
      const data = await response.json();
      setExchangeRates(data);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    if (!query) {
      setUserSearchResults([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/search?q=${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUserSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Search resources
  const searchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/users/resourcessearch', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setResourceSearchResults(data);
    } catch (error) {
      console.error('Error searching resources:', error);
    }
  };

  // Handle transfer
  const handleTransfer = async () => {
    if (!transferData.receiverName || !transferData.resourceName || !transferData.quantity) {
      setMessage('Заполните все поля!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/users/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senderName: 'current_user', // This should be handled by backend
          receiverName: transferData.receiverName,
          resourceName: transferData.resourceName,
          quantity: parseInt(transferData.quantity)
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Перевод выполнен успешно! 🎉');
        setTransferData({ receiverName: '', resourceName: '', quantity: '' });
        setUserSearch(''); // Очищаем поиск
        fetchUserResources(); // Refresh resources
      } else {
        setMessage(data.error || 'Ошибка при переводе');
      }
    } catch (error) {
      setMessage('Ошибка подключения к серверу');
    }
    setLoading(false);
  };

  // Get exchange rate history
  const getExchangeHistory = async (from, to) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/exchange-rate-history?from=${from}&to=${to}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setExchangeHistory(data);
    } catch (error) {
      console.error('Error fetching exchange history:', error);
    }
  };

  useEffect(() => {
    fetchUserResources();
    fetchExchangeRates();
    searchResources();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(userSearch);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [userSearch]);

  // Очищаем сообщение через 5 секунд
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const TabButton = ({ id, icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-6 py-3 font-mono font-bold transition-all duration-200 border-4 transform hover:scale-105 ${
        isActive 
          ? 'bg-green-600 border-green-800 text-white' 
          : 'bg-stone-700 border-stone-500 text-gray-300 hover:bg-stone-600'
      }`}
    >
      <Icon size={20} className="mr-2" />
      {label}
    </button>
  );

  // Мемоизируем компоненты табов для предотвращения пересоздания
  const ResourcesTab = useCallback(() => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-mono flex items-center">
          <Package className="mr-2 text-green-400" />
          МОИ РЕСУРСЫ
        </h2>
        <button
          onClick={fetchUserResources}
          className="bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold px-4 py-2 border-4 border-blue-800 transition-all duration-200 transform hover:scale-105"
        >
          <RefreshCw size={16} className="mr-2 inline" />
          ОБНОВИТЬ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userResources.map((resource) => (
          <div key={resource.id} className="bg-stone-700 border-4 border-stone-500 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-green-400 font-mono font-bold text-lg">
                {resource.Resource?.name || 'Неизвестный ресурс'}
              </h3>
              <div className="text-2xl font-mono font-bold text-white">
                {resource.quantity}
              </div>
            </div>
            <div className="mt-2 text-gray-300 font-mono text-sm">
              ID: {resource.resourceId}
            </div>
          </div>
        ))}
      </div>

      {userResources.length === 0 && (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400 font-mono">У вас пока нет ресурсов</p>
        </div>
      )}
    </div>
  ), [userResources]);

  // const TransferTab = useCallback(() => (
    
  // ), [userSearch, userSearchResults, transferData, resourceSearchResults, loading]);

  const ExchangeTab = useCallback(() => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-mono flex items-center">
          <TrendingUp className="mr-2 text-yellow-400" />
          КУРСЫ ОБМЕНА
        </h2>
        <button
          onClick={fetchExchangeRates}
          className="bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold px-4 py-2 border-4 border-orange-800 transition-all duration-200 transform hover:scale-105"
        >
          <RefreshCw size={16} className="mr-2 inline" />
          ОБНОВИТЬ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exchangeRates.map((rate) => (
          <div key={rate.id} className="bg-yellow-900 border-4 border-yellow-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-yellow-400 font-mono font-bold">
                  {rate.fromResource?.name || 'Неизвестно'}
                </span>
                <ArrowRight className="mx-2 text-yellow-500" size={20} />
                <span className="text-yellow-400 font-mono font-bold">
                  {rate.toResource?.name || 'Неизвестно'}
                </span>
              </div>
                <div className="text-xl font-mono font-bold text-white">
                  {rate.ratePayYou} : {rate.rateGetYou}
                </div>
            </div>
            <button
              onClick={() => {
                setSelectedExchange({
                  from: rate.fromResource?.name || '',
                  to: rate.toResource?.name || ''
                });
                getExchangeHistory(rate.fromResource?.name || '', rate.toResource?.name || '');
              }}
              className="mt-2 bg-yellow-600 hover:bg-yellow-500 text-white font-mono text-sm px-3 py-1 border-2 border-yellow-800 transition-all duration-200"
            >
              <History size={14} className="mr-1 inline" />
              ИСТОРИЯ
            </button>
          </div>
        ))}
      </div>

      {exchangeHistory.length > 0 && (
        <div className="bg-gray-800 border-4 border-gray-600 p-4">
          <h3 className="text-xl font-bold text-white font-mono mb-4">
            ИСТОРИЯ: {selectedExchange.from} → {selectedExchange.to}
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={exchangeHistory.map(entry => ({
                  timestamp: new Date(entry.timestamp).toLocaleString(),
                  rate: entry.rate,
                }))}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid stroke="#444" />
                <XAxis dataKey="timestamp" tick={{ fill: '#ccc', fontSize: 10 }} />
                <YAxis tick={{ fill: '#ccc' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#333', borderColor: '#666' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}`, 'Курс']}
                />
                <Line type="monotone" dataKey="rate" stroke="#facc15" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  ), [exchangeRates, exchangeHistory, selectedExchange]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-8 h-8 bg-green-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-purple-500 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 bg-yellow-400 rotate-12 animate-spin"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-blue-500 animate-ping"></div>
        <div className="absolute top-1/2 left-8 w-6 h-12 bg-red-500 animate-pulse"></div>
        <div className="absolute top-1/3 right-12 w-8 h-8 bg-cyan-400 rounded-full animate-bounce"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-stone-800 border-b-8 border-stone-600 p-4">
          <div className="flex items-center justify-center">
            <Gamepad2 className="text-green-400 mr-3" size={36} />
            <h1 className="text-4xl font-bold text-white font-mono">
              БАНК Doofenshmirtz Evil Inc
            </h1>
            <Zap className="text-yellow-400 ml-3 animate-pulse" size={36} />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-stone-700 border-b-8 border-stone-500 p-4">
          <div className="flex flex-wrap justify-center gap-2">
            <TabButton
              id="resources"
              icon={Package}
              label="РЕСУРСЫ"
              isActive={activeTab === 'resources'}
              onClick={() => setActiveTab('resources')}
            />
            <TabButton
              id="transfer"
              icon={Send}
              label="ПЕРЕВОД"
              isActive={activeTab === 'transfer'}
              onClick={() => setActiveTab('transfer')}
            />
            <TabButton
              id="exchange"
              icon={TrendingUp}
              label="ОБМЕН"
              isActive={activeTab === 'exchange'}
              onClick={() => setActiveTab('exchange')}
            />
            {role === 'admin' && (
              <TabButton
                id="admin"
                icon={TrendingUp}
                label="Админ-панель"
                isActive={activeTab === 'admin'}
                onClick={() => navigate('/admin')}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'transfer' && (
            <TransferTab 
              userSearch={userSearch} setUserSearch={setUserSearch}
              userSearchResults={userSearchResults}
              transferData={transferData} setTransferData={setTransferData}
              resourceSearchResults={resourceSearchResults}
              handleTransfer={handleTransfer}
              loading={loading}
            />
          )}
          {activeTab === 'resources' && <ResourcesTab />}
          {activeTab === 'exchange' && <ExchangeTab />}
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mb-4 p-4 border-4 font-mono text-sm ${
            message.includes('успешно') 
              ? 'bg-green-800 border-green-600 text-green-200' 
              : 'bg-red-800 border-red-600 text-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MinecraftResourcesDashboard;