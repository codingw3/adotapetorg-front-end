import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import logo from './images/logo-adotapetorg.jpg'
import { AuthProvider } from './contexts/AuthContext';
import Inicio from './pages/inicio/Inicio';
import Sobre from './pages/sobre/Sobre';
import UsuarioCadastrar from './pages/usuario/UsuarioCadastrar';
import UsuarioEntrar from './pages/usuario/UsuarioEntrar';
import Error404 from './pages/error/Error404';
import PetCadastrar from './pages/pet/PetCadastrar';
import PetInformacao from './pages/pet/PetInformacao';
import PetUsuarioLogado from './pages/pet/PetUsuarioLogado';
import PetUsuarioLogadoFavoritos from './pages/pet/PetUsuarioLogadoFavoritos';
import PrivateRoute from './routes/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // GERAL
      { path: "/", element: <Inicio logo={logo} /> },
      { path: "/sobre", element: <Sobre /> },
      // USUÁRIO
      { path: "/usuario/cadastrar", element: <UsuarioCadastrar /> },
      { path: "/usuario/entrar", element: <UsuarioEntrar /> },
      // PET
      { path: "/pet/cadastrar", element: <PrivateRoute element={<PetCadastrar />} /> },
      { path: "/pet/informacao/:id", element: <PetInformacao /> },
      { path: "/pet/meus", element: <PrivateRoute element={<PetUsuarioLogado />} /> },
      { path: "/pet/favoritos", element: <PrivateRoute element={<PetUsuarioLogadoFavoritos />} /> },
      // ERRO
      { path: "/*", element: <Error404 /> },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  /**
   * AXIOS fazendo duas requisições ao invés de uma
   * 
   * Explicação:
   * O <React.StrictMode> é um recurso do React que ajuda a identificar possíveis problemas em seu código e a 
   * garantir que seu código esteja seguindo as melhores práticas recomendadas pelo React. Ele faz isso executando certas verificações extras em seu código, que podem 
   * resultar em renderizações adicionais.
   * Uma das verificações adicionais que o <React.StrictMode> executa é executar o render duas vezes para ajudar a identificar possíveis efeitos colaterais que podem ocorrer 
   * durante as renderizações. Como o useEffect é um hook que é acionado após a renderização do componente, é possível que ele seja executado duas vezes devido a essa 
   * verificação adicional do <React.StrictMode>.
   * Se você quiser desligar essa feature, pode ir ao index.tsx e remover o StrictMode.
   * Vale apontar que isso só acontece durante o desenvolvimento, nas versões de produção o React remove isso pra gente. 
   * 
   * Documentação: 
   * https://pt-br.legacy.reactjs.org/docs/strict-mode.html#gatsby-focus-wrapper
   */

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
