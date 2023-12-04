import React, { useState } from 'react';
import { ToastContainer, toast, Flip } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import MyApi from '../api/myapi';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const api = new MyApi();
    const tokenapi = api.tokenApi();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        tokenapi.tokenCreate(
            {'username': username,
            'password': password,
            'access': '',
            'refresh': ''}
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
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover
            limit={1}
            transition={Flip}
        />
        </div>
    );
}
