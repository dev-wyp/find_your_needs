import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { login } from "../store/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { token, user, loading, error } = useAppSelector(
    (state: any) => state.auth
  );

  // Redirect automatically when login succeeds
  useEffect(() => {
    if (token && user.role === "admin") {
      navigate("/listings");
    } else if (token && user.role === "superAdmin") {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E0F7F4 0%, #CFF4F1 100%)",
        px: 2,
      }}>
      <Card
        sx={{ maxWidth: 400, width: "100%", borderRadius: 3, boxShadow: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant='h5'
            component='h1'
            mb={3}
            fontWeight='bold'
            align='center'>
            Login to Your Account
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TextField
              label='Email'
              type='email'
              variant='outlined'
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label='Password'
              type='password'
              variant='outlined'
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <Typography color='error' variant='body2' align='center'>
                {error}
              </Typography>
            )}

            <Button
              type='submit'
              variant='contained'
              fullWidth
              sx={{
                py: 1.5,
                mt: 1,
                background: "linear-gradient(90deg, #34E0A1, #00AF87)",
              }}
              disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                "Login"
              )}
            </Button>

            <Typography variant='body2' align='center' mt={1}>
              Don't have an account?{" "}
              <Link
                to='/register'
                style={{
                  color: "#00AF87",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}>
                Register
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
