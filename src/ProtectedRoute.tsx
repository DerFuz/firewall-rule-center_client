import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ redirectPath = '/login', children }: { redirectPath?: string, children?: React.ReactElement }) {
  // TODO verify if token is still valid, instead of checking for just a username
  if (!localStorage.getItem('username')) {
    toast.warning('You need to be authenticated: Login first');
    return <Navigate to={redirectPath} replace />;
  }

  return (children ? children : <Outlet />);
};