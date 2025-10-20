import React from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Notification from './components/Notification';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import { NotificationProvider } from './contexts/NotificationContext';
import useAuth from './hooks/useAuth';
import './styles/globals.css';

function App() {
  const auth = useAuth();

  const path = window.location.pathname;

  const renderRoute = () => {
    if (path === '/login') return <Login />;
    if (path === '/register') return <Register />;
    if (path === '/dashboard') {
      if (!auth.user) {
        window.location.href = '/login';
        return null;
      }
      return <Dashboard auth={auth} />;
    }
    if (path === '/') return <Home />;
    // Default route
    return <Login />;
  };

  return (
    <NotificationProvider>
      <div className="App">
  <Navbar user={auth.user} logout={auth.logout} />
        <div className="app-content">{renderRoute()}</div>
        <Notification />
        <Footer />
      </div>
    </NotificationProvider>
  );
}

export default App;