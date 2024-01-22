import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MyApi from '../api/myapi';
import { useNavigate } from "react-router-dom";
import { FirewallRuleCenterClientToastContainer } from '../../Generics';

export default function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const api = new MyApi();
    const tokenapi = api.tokenApi();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
        <div className="login-wrapper">
        <h1>Please Log In</h1>
        <form onSubmit={handleSubmit}>
            <label>
            <p>Username</p>
            <input type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
            <button type="submit">Submit</button>
            </div>
        </form>
        <FirewallRuleCenterClientToastContainer />
        </div>
    );
}
