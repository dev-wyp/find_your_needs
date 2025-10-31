import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../shared/hooks";
import { logout } from "../store/auth/authSlice";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Drawer state for mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
          >
            Find Your Needs
          </Typography>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
            {navLinks.map((link) => (
              <Button
                key={link.name}
                component={Link}
                to={link.path}
                color="inherit"
              >
                {link.name}
              </Button>
            ))}

            {token ? (
              <>
                <Typography variant="body1">Hello, {user?.name || "User"}</Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Login
                </Button>
                <Button component={Link} to="/register" color="inherit">
                  Register
                </Button>
              </>
            )}
          </Box>

          {/* Mobile menu icon */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
          <List>
            {navLinks.map((link) => (
              <ListItem button key={link.name} component={Link} to={link.path}>
                <ListItemText primary={link.name} />
              </ListItem>
            ))}

            {token ? (
              <>
                <ListItem>
                  <ListItemText primary={`Hello, ${user?.name || "User"}`} />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} to="/register">
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
