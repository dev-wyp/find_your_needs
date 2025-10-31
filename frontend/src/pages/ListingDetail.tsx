import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
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

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        setForm({
          title: res.data.title,
          description: res.data.description,
          type: res.data.type,
          address: res.data.address,
          city: res.data.city,
          country: res.data.country,
          phone: res.data.phone,
          website: res.data.website,
        });
      })
      .catch(() => navigate("/listings"));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    await axios.delete(`http://localhost:4000/api/listings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/listings");
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:4000/api/listings/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setListing({ ...listing, ...form });
    setOpenEdit(false);
  };

  if (!listing) return <Typography align="center">Loading...</Typography>;

  return (
    <Box maxWidth="md" mx="auto" mt={5}>
      <Card>
        {listing.images?.length > 0 && (
          <CardMedia
            component="img"
            height="300"
            image={listing.images[0]}
            alt={listing.title}
          />
        )}
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {listing.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {listing.description}
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Typography variant="body2">{listing.city}, {listing.country}</Typography>
            {listing.phone && <Typography variant="body2">📞 {listing.phone}</Typography>}
            {listing.website && (
              <Typography variant="body2">
                🌐 <a href={listing.website} target="_blank" rel="noreferrer">{listing.website}</a>
              </Typography>
            )}
          </Stack>

          {isAdmin && (
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setOpenEdit(true)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Edit Listing
          <IconButton
            aria-label="close"
            onClick={() => setOpenEdit(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            {Object.keys(form).map((key) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                value={form[key] || ""}
                onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                fullWidth
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
