import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './pages/Index.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Panel from './pages/Panel.jsx';
import Layout from './Layout.jsx';
import { UserProvider } from './context/UserContext.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
  { index: true, element: <Index /> },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  { path: 'panel', element: <Panel /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
