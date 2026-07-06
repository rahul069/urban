
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store';
import { initI18n } from './i18n';
import { ApiProvider } from './context/ApiContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import HeroSection from './components/HeroSection';

initI18n();

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ApiProvider>
          <Router>
            <HeroSection />
          </Router>
        </ApiProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;