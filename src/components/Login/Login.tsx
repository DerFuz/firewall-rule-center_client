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

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const api = new MyApi();
  const tokenapi = api.tokenApi();

  const handleSubmit = () => {
    tokenapi.tokenCreate(
      {
        'username': username,
        'password': password,
      }
    ).then((response) => {
      console.log("Access-Token: ", response.data.access);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: 0,
        toastId: "my_toast",
      });
      navigate("/rules");
    }, (response) => {
      console.log(response);
      // TODO Check Error
      toast.error("Login failed: " + response.response.data.detail, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: 0,
        toastId: "my_toast",
      });
    });
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
