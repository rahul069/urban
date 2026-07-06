
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { store } from './store';
import { initI18n } from './i18n';
import { ApiProvider } from './context/ApiContext';
import { AuthProvider } from './context/AuthContext';
import VerificationQueue from './screens/VerificationQueue';
import BookingMonitor from './screens/BookingMonitor';
import './App.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

initI18n();

const App = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('de');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <Provider store={store}>
      <AuthProvider>
        <ApiProvider>
          <Router>
            <div className="navbar">
              <div>
                <Link to="/">{t('verification.title')}</Link>
                <Link to="/bookings">{t('bookings.title')}</Link>
              </div>
              <div className="language-switcher">
                <button
                  className={language === 'en' ? 'active' : ''}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </button>
                <button
                  className={language === 'de' ? 'active' : ''}
                  onClick={() => changeLanguage('de')}
                >
                  Deutsch
                </button>
              </div>
            </div>
            <Switch>
              <Route exact path="/" component={VerificationQueue} />
              <Route path="/bookings" component={BookingMonitor} />
            </Switch>
          </Router>
        </ApiProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;