   import { Navigate, Outlet } from 'react-router-dom';
   const ProtectedRoute = ({ isAuthenticated, redirectPath = '/Login' }) => {
     if (!isAuthenticated) {
       return <Navigate to={redirectPath} replace />;
     }
     return <Outlet />; // or return the children if you prefer
   };