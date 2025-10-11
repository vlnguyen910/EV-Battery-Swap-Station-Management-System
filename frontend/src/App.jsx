import { Toaster, toast } from 'sonner'
import Navigation from './components/layout/Navigation'
import { AppRoutes } from './routes'

function App() {
  return (
    <div className="App overflow-x-hidden min-h-screen w-full">
      <main className="w-full">
        <Toaster position="top-right" richColors />
        <AppRoutes />
      </main>
    </div>
  );
}
export default App;

