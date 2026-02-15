import { Providers } from './providers';
import { AppRouter } from './router';
import { AuthInitializer } from '../components/auth/AuthInitializer';

function App() {
  return (
    <Providers>
      <AuthInitializer />
      <AppRouter />
    </Providers>
  );
}

export default App;
