import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Inicio from './components/pages/inicio/Inicio';
import Sobre from './components/pages/sobre/Sobre';
import logo from './images/logo.jpg'
import { AuthProvider } from './contexts/AuthContext';
import UsuarioCadastrar from './components/pages/usuario/UsuarioCadastrar';
import UsuarioEntrar from './components/pages/usuario/UsuarioEntrar';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Inicio logo={logo} /> },
      { path: "/sobre", element: <Sobre /> },
      { path: "/usuario/cadastrar", element: <UsuarioCadastrar /> },
      { path: "/usuario/entrar", element: <UsuarioEntrar /> },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// Se você deseja começar a medir o desempenho em seu aplicativo, passe uma função
// para registrar os resultados (por exemplo: reportWebVitals(console.log))
// ou envie para um endpoint analítico. Saiba mais: https://bit.ly/CRA-vitals
reportWebVitals();
