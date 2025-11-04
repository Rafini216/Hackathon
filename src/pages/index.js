import { useState, useEffect } from 'react';
import Form from '../components/LogInForm';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };


  if (!user) {
    return (<div className="flex justify-center items-center min-h-screen"><Form onLogin={handleLogin} /></div>);
  }


  return (
    <div>
      <h1>Login Successful!</h1>
      
      <div>
        <h2>User Information:</h2>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>ID: {user.id}</p>
      </div>



      <button onClick={handleLogout}>
        Logout & Test Again
      </button>
    </div>
  );
}
