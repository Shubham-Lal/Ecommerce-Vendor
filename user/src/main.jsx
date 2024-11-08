import { Suspense } from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './store/index';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <Suspense>
      <App />
      <Toaster
        toastOptions={{
          position: 'top-right',
          style: {
            background: '#283046',
            color: 'white'
          }
        }}
      />
    </Suspense>
  </Provider>
)
