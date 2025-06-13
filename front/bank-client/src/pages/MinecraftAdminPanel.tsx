import React, { useState, useEffect } from 'react';
import { Shield, Package, TrendingUp, Users, Plus, RefreshCw, Settings, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Компонент вкладки ресурсов
const ResourcesTab = ({ 
  bankResources, 
  allResources, 
  newResource, 
  setNewResource,
  bankResourceData, 
  setBankResourceData,
  loading,
  onCreateResource,
  onAddToBankResources,
  onRefreshBankResources
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white font-mono flex items-center">
        <Package className="mr-2 text-green-400" />
        УПРАВЛЕНИЕ РЕСУРСАМИ
      </h2>
      <button
        onClick={onRefreshBankResources}
        className="bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold px-4 py-2 border-4 border-blue-800 transition-all duration-200 transform hover:scale-105"
      >
        <RefreshCw size={16} className="mr-2 inline" />
        ОБНОВИТЬ
      </button>
    </div>

    {/* Create new resource */}
    <div className="bg-slate-700 border-4 border-green-500 p-6">
      <h3 className="text-xl font-bold text-green-400 font-mono mb-4 flex items-center">
        <Plus className="mr-2" />
        СОЗДАТЬ НОВЫЙ РЕСУРС
      </h3>
      <div className="flex gap-4">
        <input
          type="text"
          value={newResource}
          onChange={(e) => setNewResource(e.target.value)}
          className="flex-1 py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors"
          placeholder="Название ресурса"
        />
        <button
          onClick={onCreateResource}
          disabled={loading}
          className="bg-green-600 hover:bg-green-500 text-white font-bold font-mono py-3 px-6 border-4 border-green-800 hover:border-green-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'СОЗДАНИЕ...' : 'СОЗДАТЬ'}
        </button>
      </div>
    </div>

    {/* Add to bank resources */}
    <div className="bg-slate-700 border-4 border-blue-500 p-6">
      <h3 className="text-xl font-bold text-blue-400 font-mono mb-4 flex items-center">
        <Shield className="mr-2" />
        ДОБАВИТЬ РЕСУРСЫ В БАНК
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={bankResourceData.resourceName}
          onChange={(e) => setBankResourceData({...bankResourceData, resourceName: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono focus:border-blue-400 focus:outline-none transition-colors"
        >
          <option value="">Выберите ресурс</option>
          {allResources.map((resource) => (
            <option key={resource.id} value={resource.name}>
              {resource.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={bankResourceData.quantity}
          onChange={(e) => setBankResourceData({...bankResourceData, quantity: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="Количество"
          min="1"
        />
        <button
          onClick={onAddToBankResources}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono py-3 px-6 border-4 border-blue-800 hover:border-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'ДОБАВЛЕНИЕ...' : 'ДОБАВИТЬ'}
        </button>
      </div>
    </div>

    {/* Bank resources display */}
    <div className="bg-slate-700 border-4 border-purple-500 p-6">
      <h3 className="text-xl font-bold text-purple-400 font-mono mb-4">
        РЕСУРСЫ БАНКА
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bankResources.map((resource, index) => (
          <div key={index} className="bg-purple-800 border-4 border-purple-600 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-purple-200 font-mono font-bold text-lg">
                {resource.name}
              </h4>
              <div className="text-2xl font-mono font-bold text-white">
                {resource.totalQuantity}
              </div>
            </div>
          </div>
        ))}
      </div>
      {bankResources.length === 0 && (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400 font-mono">Нет ресурсов в банке</p>
        </div>
      )}
    </div>
  </div>
);

// Компонент вкладки курсов
const ExchangeTab = ({ 
  exchangeRates, 
  allResources, 
  exchangeRateData, 
  setExchangeRateData,
  loading,
  onSetExchangeRate,
  onRefreshExchangeRates,
  error
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white font-mono flex items-center">
        <TrendingUp className="mr-2 text-yellow-400" />
        УПРАВЛЕНИЕ КУРСАМИ
      </h2>
      <button
        onClick={onRefreshExchangeRates}
        className="bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold px-4 py-2 border-4 border-orange-800 transition-all duration-200 transform hover:scale-105"
      >
        <RefreshCw size={16} className="mr-2 inline" />
        ОБНОВИТЬ
      </button>
    </div>

    {/* Error display */}
    {error && (
      <div className="bg-red-800 border-4 border-red-600 text-red-200 p-4 font-mono">
        Ошибка: {error}
      </div>
    )}

    {/* Set exchange rate */}
    <div className="bg-slate-700 border-4 border-yellow-500 p-6">
      <h3 className="text-xl font-bold text-yellow-400 font-mono mb-4 flex items-center">
        <Settings className="mr-2" />
        УСТАНОВИТЬ КУРС ОБМЕНА
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select
          value={exchangeRateData.from}
          onChange={(e) => setExchangeRateData({...exchangeRateData, from: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono focus:border-yellow-400 focus:outline-none transition-colors"
        >
          <option value="">Из ресурса</option>
          {allResources.map((resource) => (
            <option key={resource.id} value={resource.name}>
              {resource.name}
            </option>
          ))}
        </select>
        <select
          value={exchangeRateData.to}
          onChange={(e) => setExchangeRateData({...exchangeRateData, to: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono focus:border-yellow-400 focus:outline-none transition-colors"
        >
          <option value="">В ресурс</option>
          {allResources.map((resource) => (
            <option key={resource.id} value={resource.name}>
              {resource.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.001"
          value={exchangeRateData.ratePayYou}
          onChange={(e) => setExchangeRateData({...exchangeRateData, ratePayYou: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
          placeholder="Курс (вы платите)"
          min="0.001"
        />
        <input
          type="number"
          step="0.001"
          value={exchangeRateData.rateGetYou}
          onChange={(e) => setExchangeRateData({...exchangeRateData, rateGetYou: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
          placeholder="Курс (вы получаете)"
          min="0.001"
        />
        <button
          onClick={onSetExchangeRate}
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold font-mono py-3 px-6 border-4 border-yellow-800 hover:border-yellow-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'УСТАНОВКА...' : 'УСТАНОВИТЬ'}
        </button>
      </div>
    </div>

   {/* Current exchange rates */}
<div className="bg-slate-700 border-4 border-orange-500 p-6">
  <h3 className="text-xl font-bold text-orange-400 font-mono mb-4">
    ТЕКУЩИЕ КУРСЫ ОБМЕНА
  </h3>
  {loading ? (
    <div className="text-center py-8">
      <RefreshCw size={48} className="mx-auto text-orange-400 mb-4 animate-spin" />
      <p className="text-orange-300 font-mono">Загрузка курсов...</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exchangeRates.map((rate) => (
        <div key={rate.id} className="bg-orange-800 border-4 border-orange-600 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-orange-200 font-mono font-bold">
                {rate.fromResource?.name || 'Неизвестно'}
              </span>
              <span className="mx-2 text-orange-400">→</span>
              <span className="text-orange-200 font-mono font-bold">
                {rate.toResource?.name || 'Неизвестно'}
              </span>
            </div>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            {rate.ratePayYou} : {rate.rateGetYou}
          </div>
        </div>
      ))}
    </div>
  )}
  {!loading && exchangeRates.length === 0 && (
    <div className="text-center py-8">
      <TrendingUp size={48} className="mx-auto text-gray-500 mb-4" />
      <p className="text-gray-400 font-mono">Нет установленных курсов обмена</p>
    </div>
  )}
</div>
  </div>
);

// Компонент вкладки пользователей
const UsersTab = ({ 
  allResources, 
  userResourceData, 
  setUserResourceData,
  loading,
  onAddToUserResources
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white font-mono flex items-center">
      <Users className="mr-2 text-cyan-400" />
      УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ
    </h2>

    {/* Add resources to user */}
    <div className="bg-slate-700 border-4 border-cyan-500 p-6">
      <h3 className="text-xl font-bold text-cyan-400 font-mono mb-4 flex items-center">
        <Plus className="mr-2" />
        ДОБАВИТЬ РЕСУРСЫ ПОЛЬЗОВАТЕЛЮ
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          value={userResourceData.username}
          onChange={(e) => setUserResourceData({...userResourceData, username: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
          placeholder="Имя пользователя"
        />
        <select
          value={userResourceData.resourceName}
          onChange={(e) => setUserResourceData({...userResourceData, resourceName: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono focus:border-cyan-400 focus:outline-none transition-colors"
        >
          <option value="">Выберите ресурс</option>
          {allResources.map((resource) => (
            <option key={resource.id} value={resource.name}>
              {resource.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={userResourceData.quantity}
          onChange={(e) => setUserResourceData({...userResourceData, quantity: e.target.value})}
          className="py-3 px-4 bg-slate-600 border-4 border-slate-400 text-white font-mono placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
          placeholder="Количество"
          min="1"
        />
        <button
          onClick={onAddToUserResources}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono py-3 px-6 border-4 border-cyan-800 hover:border-cyan-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'ДОБАВЛЕНИЕ...' : 'ДОБАВИТЬ'}
        </button>
      </div>
    </div>
  </div>
);

// Компонент кнопки вкладки
const TabButton = ({ id, icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-6 py-3 font-mono font-bold transition-all duration-200 border-4 transform hover:scale-105 ${
      isActive 
        ? 'bg-red-600 border-red-800 text-white' 
        : 'bg-stone-700 border-stone-500 text-gray-300 hover:bg-stone-600'
    }`}
  >
    <Icon size={20} className="mr-2" />
    {label}
  </button>
);

// Основной компонент
const MinecraftAdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Resources state
  const [bankResources, setBankResources] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [newResource, setNewResource] = useState('');
  
  // Bank resources state
  const [bankResourceData, setBankResourceData] = useState({
    resourceName: '',
    quantity: ''
  });
  
  // Exchange rates state
  const [exchangeRateData, setExchangeRateData] = useState({
    from: '',
    to: '',
    ratePayYou: '',
    rateGetYou: '',
  });
  const [exchangeRates, setExchangeRates] = useState([]);
  
  // User resources state
  const [userResourceData, setUserResourceData] = useState({
    username: '',
    resourceName: '',
    quantity: ''
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      let role;
      if (token) {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        role = payload.role;
      }

      if (role !== 'admin') navigate('/home');
    } catch (error) {
      console.error('Error checking role:', error);
    }
  }, [navigate]);

  // API calls
  const fetchBankResources = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch('https://fufelschmerz-filth-inc-1.onrender.com/admin/bank-resources', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBankResources(data);
    } catch (error) {
      console.error('Error fetching bank resources:', error);
      setError('Ошибка загрузки ресурсов банка: ' + error.message);
    }
  };
  
  const fetchAllResources = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch('https://fufelschmerz-filth-inc-1.onrender.com/users/resourcessearch', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Ошибка загрузки списка ресурсов: ' + error.message);
    }
  };
  
  const fetchExchangeRates = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await fetch('https://fufelschmerz-filth-inc-1.onrender.com/users/exchange-rates');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExchangeRates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setError('Ошибка загрузки курсов обмена: ' + error.message);
      setExchangeRates([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new resource
  const handleCreateResource = async () => {
    if (!newResource.trim()) {
      setMessage('Введите название ресурса!');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://fufelschmerz-filth-inc-1.onrender.com/admin/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newResource })
      });
      
      if (response.ok) {
        setMessage('Ресурс создан успешно! 🎉');
        setNewResource('');
        fetchBankResources();
        fetchAllResources();
      } else {
        const error = await response.json();
        setMessage(error.error || 'Ошибка при создании ресурса');
      }
    } catch (error) {
      setMessage('Ошибка подключения к серверу');
    }
    setLoading(false);
  };

  // Add resources to bank
  const handleAddToBankResources = async () => {
    if (!bankResourceData.resourceName || !bankResourceData.quantity) {
      setMessage('Заполните все поля!');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://fufelschmerz-filth-inc-1.onrender.com/admin/bank-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resourceName: bankResourceData.resourceName,
          quantity: parseInt(bankResourceData.quantity)
        })
      });
      
      if (response.ok) {
        setMessage('Ресурсы добавлены в банк! 🎉');
        setBankResourceData({ resourceName: '', quantity: '' });
        fetchBankResources();
      } else {
        const error = await response.json();
        setMessage(error.error || 'Ошибка при добавлении ресурсов');
      }
    } catch (error) {
      setMessage('Ошибка подключения к серверу');
    }
    setLoading(false);
  };

  // Set exchange rate
  const handleSetExchangeRate = async () => {
    if (!exchangeRateData.from || !exchangeRateData.to || !exchangeRateData.ratePayYou || !exchangeRateData.rateGetYou) {
      setMessage('Заполните все поля!');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://fufelschmerz-filth-inc-1.onrender.com/admin/exchange-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          from: exchangeRateData.from,
          to: exchangeRateData.to,
          ratePayYou: parseFloat(exchangeRateData.ratePayYou),
          rateGetYou: parseFloat(exchangeRateData.rateGetYou)
        })
      });
      
      if (response.ok) {
        setMessage('Курс обмена установлен! 🎉');
        setExchangeRateData({ from: '', to: '', ratePayYou: '', rateGetYou: '' });
        fetchExchangeRates();
      } else {
        const error = await response.json();
        setMessage(error.error || 'Ошибка при установке курса');
      }
    } catch (error) {
      setMessage('Ошибка подключения к серверу');
    }
    setLoading(false);
  };

  // Add resources to user
  const handleAddToUserResources = async () => {
    if (!userResourceData.username || !userResourceData.resourceName || !userResourceData.quantity) {
      setMessage('Заполните все поля!');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fufelschmerz-filth-inc-1.onrender.com/admin/users/${userResourceData.username}/resources/${userResourceData.resourceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: parseInt(userResourceData.quantity)
        })
      });
      
      if (response.ok) {
        setMessage('Ресурсы добавлены пользователю! 🎉');
        setUserResourceData({ username: '', resourceName: '', quantity: '' });
      } else {
        const error = await response.json();
        setMessage(error.error || 'Ошибка при добавлении ресурсов');
      }
    } catch (error) {
      setMessage('Ошибка подключения к серверу');
    }
    setLoading(false);
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'exchange') {
      fetchExchangeRates();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBankResources();
    fetchAllResources();
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-red-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-8 h-8 bg-red-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-6 h-6 bg-purple-500 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-10 h-10 bg-yellow-400 rotate-12 animate-spin"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-blue-500 animate-ping"></div>
        <div className="absolute top-1/2 left-8 w-6 h-12 bg-orange-500 animate-pulse"></div>
        <div className="absolute top-1/3 right-12 w-8 h-8 bg-cyan-400 rounded-full animate-bounce"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-stone-800 border-b-8 border-red-600 p-4">
          <div className="flex items-center justify-center">
            <Crown className="text-red-400 mr-3" size={36} />
            <h1 className="text-4xl font-bold text-white font-mono">
              АДМИН-ПАНЕЛЬ Doofenshmirtz Evil Inc
            </h1>
            <Zap className="text-red-400 ml-3 animate-pulse" size={36} />
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
              id="exchange"
              icon={TrendingUp}
              label="КУРСЫ"
              isActive={activeTab === 'exchange'}
              onClick={() => setActiveTab('exchange')}
            />
            <TabButton
              id="users"
              icon={Users}
              label="ПОЛЬЗОВАТЕЛИ"
              isActive={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'resources' && (
            <ResourcesTab
              bankResources={bankResources}
              allResources={allResources}
              newResource={newResource}
              setNewResource={setNewResource}
              bankResourceData={bankResourceData}
              setBankResourceData={setBankResourceData}
              loading={loading}
              onCreateResource={handleCreateResource}
              onAddToBankResources={handleAddToBankResources}
              onRefreshBankResources={fetchBankResources}
            />
          )}
          {activeTab === 'exchange' && (
            <ExchangeTab
              exchangeRates={exchangeRates}
              allResources={allResources}
              exchangeRateData={exchangeRateData}
              setExchangeRateData={setExchangeRateData}
              loading={loading}
              onSetExchangeRate={handleSetExchangeRate}
              onRefreshExchangeRates={fetchExchangeRates}
            />
          )}
          {activeTab === 'users' && (
            <UsersTab
              allResources={allResources}
              userResourceData={userResourceData}
              setUserResourceData={setUserResourceData}
              loading={loading}
              onAddToUserResources={handleAddToUserResources}
            />
          )}
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

export default MinecraftAdminPanel;