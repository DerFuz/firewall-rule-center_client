import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MyApi from '../api/myapi';
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { FirewallRuleCenterClientToastContainer } from '../../Generics';
import { AxiosError } from 'axios';

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
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
      console.log("Access-Token: ", responseTokenCreate.data.access);
      localStorage.setItem("access", responseTokenCreate.data.access);
      localStorage.setItem("refresh", responseTokenCreate.data.refresh);
      localStorage.setItem("username", username);
      toast.success("Login successful");
      navigate("/rules");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Login failed: " + JSON.stringify(error.response.data));
      }
    }
  };

  function verifyToken(token: string) {
    tokenapi.tokenVerifyCreate(
      { 'token': token }
    ).then((value) => {
      console.log(value)
    });
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Please Log-In
      </Typography>

      <form >
        <Stack spacing={2} direction="column">
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            InputLabelProps={{ shrink: true }}
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUserName(e.target.value)}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
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

      <FirewallRuleCenterClientToastContainer />
    </Container>
  );
}
