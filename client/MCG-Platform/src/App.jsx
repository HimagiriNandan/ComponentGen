import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/landingPage';
import SessionManager from './components/SessionManager';
import MainWorkspace from './components/MainWorkspace';
import { Provider } from 'react-redux';
import store from './store';
import useAuthInit from './hooks/authInit';
import { useSelector } from 'react-redux';

function App() {
  useAuthInit();
  const { user, email } = useSelector((state) => state.user);
  const handleSession = () => {
    if(user && email) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login mode="signup" />} />
        <Route path="/dashboard" element={handleSession() ? <SessionManager /> : <LandingPage />} />
        <Route path="/workspace" element={handleSession() ? <MainWorkspace /> : <LandingPage />} />
      </Routes>
    </Router>
  );
}

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;
