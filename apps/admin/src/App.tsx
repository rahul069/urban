
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { store } from './store';
import { initI18n } from './i18n';
import { ApiProvider } from './context/ApiContext';
import { AuthProvider } from './context/AuthContext';
import VerificationQueue from './screens/VerificationQueue';
import BookingMonitor from './screens/BookingMonitor';


initI18n();

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ApiProvider>
          <Router>
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