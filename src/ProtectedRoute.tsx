import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({redirectPath = '/login', children}:{redirectPath?: string, children?: React.ReactElement}) {
  // TODO verify if token is still valid, instead of checking for just a username
  if (!localStorage.getItem('username')) {
    return <Navigate to={redirectPath} replace />;
  }

  return (children ? children : <Outlet />);
};