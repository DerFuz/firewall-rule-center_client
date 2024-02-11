import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login/Login';
import MyApi from './components/api/myapi';
import RuleEntry from './components/Rule/RuleEntry';
import RuleTable from './components/Rule/RuleTable';
import CreateRuleSetRequest from './components/RuleSetRequest/CreateRuleSetRequest';
import RuleSetRequestEntry from './components/RuleSetRequest/RuleSetRequestEntry';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { redirect } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Response interceptor to try getting a new access token
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    const isTokenRefreshRequest = originalConfig.url && originalConfig.url.endsWith('/api/token/refresh/');

    if (!isTokenRefreshRequest) {
      const refreshToken = localStorage.getItem('refresh');
      if (error.response && error.response.status === 401 && originalConfig && !originalConfig._retry && refreshToken) {
        originalConfig._retry = true;

        try {
          const api = new MyApi();
          const tokenapi = api.tokenApi();
          console.log('App |', 'Unauthorized request intercepted - trying to refresh access-token');
          const response = await tokenapi.tokenRefreshCreate(
            {
              'refresh': refreshToken
            }
          );
          if (response && response.status === 200) {
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            originalConfig.headers.Authorization = 'Bearer ' + response.data.access;
            console.log('App |', 'Access-token is refreshed. Retrying request...');
            return axios(originalConfig);
          }
          else {
            localStorage.removeItem('refresh');
            localStorage.removeItem('access');
            localStorage.removeItem('username');
            console.log('App |', 'Access-token could not be refreshed. Redirect to login...');
            return redirect('/login');
          }
        } catch (error) {
          console.log('App |', 'Error when refreshing access token:', error);
        }
      }
      return Promise.reject(error);
    }
  }
);

function App() {

  if (process.env.NODE_ENV === 'production') {
    console.log = () => { };
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={'/rules'} replace />} />
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/rules'>
            <Route path=':ruleId' element={<RuleEntry />} />
            <Route index element={
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <RuleTable />
              </LocalizationProvider>
            } />
          </Route>
          <Route path='/rulesetrequest'>
            <Route path=':rulesetrequestId' element={<RuleSetRequestEntry />} />
            <Route index element={<CreateRuleSetRequest />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;