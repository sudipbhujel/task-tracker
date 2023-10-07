import Layout from '@/components/layout';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainPage from './pages';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

// const ProtectedRoute = ({
//   element,
// }: {
//   element: React.ReactElement | null;
// }) => {
//   const { user } = useAuthContext();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return element;
// };

function App() {
  return (
    <AuthProvider>
      {/* <RouterProvider
        router={router}
        fallbackElement={<p>Initial Load...</p>}
      /> */}
      <Routes>
        <Route path="/" Component={Layout}>
          <Route index element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
