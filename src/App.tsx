import {BrowserRouter, Route, Routes, useParams} from 'react-router-dom';
import Home from './Home';
import axios from 'axios';
import Login from './components/Login/Login';
import MyApi from './components/api/myapi';
import RuleEntry from './components/Rule/RuleEntry';
import RuleTable from './components/RuleTable/RuleTable';
import RuleSetRequestEntry, { CreateRuleSetRequest } from './components/RuleSetRequest/RuleSetRequest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
            
            const response = await tokenapi.tokenRefreshCreate(
              {
                'refresh': refreshToken
              }
            );
            if (response && response.status === 200) {
              localStorage.setItem('access', response.data.access);
              localStorage.setItem('refresh', response.data.refresh);
              originalConfig.headers.Authorization = 'Bearer ' + response.data.access;
              return axios(originalConfig);
            }
          } catch (error) {
            console.log(error);
          }
        }
        return Promise.reject(error);
      }
    }
);

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules">
          <Route path=":ruleId" element={<RuleEntry />} />
          <Route index element={
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <RuleTable />
            </LocalizationProvider>
            } />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/rulesetrequest">
          <Route path=":rulesetrequestId" element={<RuleSetRequestEntry />} />
          <Route index element={<CreateRuleSetRequest />} />
        </Route>
      </Routes>
    </BrowserRouter>
);
}

export default App;
