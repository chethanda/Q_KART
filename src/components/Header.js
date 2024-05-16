import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, avatarClasses, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import TextField from "@mui/material";
import {Link, useHistory} from 'react-router-dom'
const Header = ({ children, hasHiddenAuthButtons }) => {
    let username = localStorage.getItem('username')
    let token = localStorage.getItem('token')
    let history = useHistory();
    function handleLogout() {
      localStorage.removeItem('username')
      localStorage.removeItem('token')
      localStorage.removeItem('balance')
      history.push('/')
      window.location.reload() 
    }
    function handleRedirection(location)  {
      if(location === 'login')  {
        history.push('/login')
      } else if (location === 'products') {
        history.push('/')
      } else if(location === 'register')  {
        history.push('/register')
      }
    }
    if(token === null)  {
      return hasHiddenAuthButtons ? (
        <Box className="header">
          <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => {
              handleRedirection("products");
            }}
          >
            Back to explore
          </Button>
        </Box>
      ) : (
        <Box className="header">
          <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              onClick={() => {
                handleRedirection("login");
              }}
            >
              Login
            </Button>
            <Button
              className="button"
              variant="text"
              onClick={() => {
                handleRedirection("register");
              }}
            >
              Register
            </Button>
          </Stack>
        </Box>
      );
    } else  {
      return (
        <Box className="header">
          <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
            {children}
          <Stack direction={"row"} spacing={2}>
            <Avatar alt={username} src="avatar.png" />
            <div style={{ justifyContent: "center" }}>
              <p className="username-text">{username}</p>
            </div>
            <Button
              variant="text"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      );
    

    }
  }
export default Header;
