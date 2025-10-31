import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const listingTypes = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "HOTEL", label: "Hotel" },
  { value: "SHOP", label: "Shop" },
];

export default function AddListingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:4000/api/listings", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/listings");
    } catch (err) {
      console.error(err);
      alert("Failed to add listing");
    }
  };

  return (
    <Card sx={{ maxWidth: 700, mx: "auto", mt: 8, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Add New Listing
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                fullWidth
                required
              >
                {listingTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Website"
                name="website"
                value={form.website}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" mt={3}>
            <Button type="submit" variant="contained" size="large">
              Save Listing
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
