import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MyApi from '../api/myapi';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Container,
  TextField,
  Button,
  Stack,
  Box
} from '@mui/material';
import { FirewallRuleCenterClientToastContainer } from '../../Generics';
import { AxiosError } from 'axios';

export default function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const api = new MyApi();
  const tokenapi = api.tokenApi();

  const handleSubmit = async () => {
    try {
      const responseTokenCreate = await tokenapi.tokenCreate(
        {
          'username': username,
          'password': password,
        }
      );
      console.log('Login |', 'Login successful. Setting access-, refresh-token and username to localStorage')
      localStorage.setItem('access', responseTokenCreate.data.access);
      localStorage.setItem('refresh', responseTokenCreate.data.refresh);
      localStorage.setItem('username', username);
      toast.success(`Login successful. Welcome ${username}`);
      navigate('/rules');
    } catch (error) {
      console.log('Login |', 'Error logging in', error);
      if (error instanceof AxiosError && error.response) {
        toast.error('Login failed: ' + JSON.stringify(error.response.data.detail));
      }
    }
  };


  return (
    <Container>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100vh'}
      >
        <Typography variant='h4' gutterBottom>
          Please Log-In
        </Typography>

        <form>
          <Stack spacing={2} direction='column'>
            <TextField
              fullWidth
              id='username'
              name='username'
              label='Username'
              InputLabelProps={{ shrink: true }}
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUserName(e.target.value)}
            />

            <TextField
              fullWidth
              id='password'
              name='password'
              label='Password'
              type='password'
              InputLabelProps={{ shrink: true }}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
            />

            <Button
              type='submit'
              color='primary'
              variant='contained'
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }
              }
            >
              Log In
            </Button>
          </Stack>
        </form>

      </Box>
      <FirewallRuleCenterClientToastContainer />
    </Container>
  );
}
