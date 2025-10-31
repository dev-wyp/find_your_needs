import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { fetchListings } from "../store/listings/listingSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Skeleton,
  Pagination,
  MenuItem,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

const listingTypes = [
  { value: "", label: "All Types" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "HOTEL", label: "Hotel" },
  { value: "SHOP", label: "Shop" },
];

export default function ListingPage() {
  const dispatch = useAppDispatch();
  const { items, loading, page, totalPages } = useAppSelector(
    (s) => s.listings as any
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    city: "",
    country: "",
    search: "",
  });

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  // Fetch listings whenever page or filters change
  useEffect(() => {
    dispatch(
      fetchListings({
        page: currentPage,
        limit: 12,
      })
    );
  }, [dispatch, currentPage]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (filters: any) => {
    dispatch(
      fetchListings({
        page: 1,
        limit: 12,
        payload: { ...filters },
      })
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleReset = () => {
    setFilters({ type: "", city: "", country: "", search: "" });
    dispatch(
      fetchListings({
        page: 1,
        limit: 12,
      })
    );
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Grid container spacing={4} padding={4}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
            <Skeleton
              variant='rectangular'
              height={280}
              sx={{ borderRadius: 3 }}
            />
            <Skeleton sx={{ mt: 1 }} width='60%' />
            <Skeleton sx={{ mt: 0.5 }} width='80%' />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9F9F9", py: 10 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
          }}>
          <Typography variant='h3' fontWeight={800} color='#2C2C2C'>
            Explore Top Places
          </Typography>

          {user?.role === "admin" && (
            <Button
              component={Link}
              to='/listing/new'
              variant='contained'
              sx={{
                bgcolor: "#34E0A1",
                "&:hover": { bgcolor: "#00AF87" },
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
              }}>
              + Add Listing
            </Button>
          )}
        </Box>

        {/* Filters */}
        <Card sx={{ p: 2, mb: 4 }}>
          <CardContent>
            <Typography variant='h6' fontWeight='bold' gutterBottom>
              Filter Listings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label='Type'
                    name='type'
                    value={filters.type}
                    onChange={handleChange}>
                    {listingTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label='City'
                  name='city'
                  value={filters.city}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label='Country'
                  name='country'
                  value={filters.country}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label='Search'
                  name='search'
                  value={filters.search}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Stack direction='row' spacing={2} mt={2}>
              <Button variant='contained' onClick={() => handleSearch(filters)}>
                Apply
              </Button>
              <Button variant='outlined' onClick={handleReset}>
                Reset
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Listings Grid */}
        <Grid container spacing={4}>
          {items.map((it: any, index: number) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={it.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}>
                <Card
                  component={Link}
                  to={`/listing/${it.id}`}
                  sx={{
                    textDecoration: "none",
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "box-shadow 0.3s",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    },
                  }}>
                  <Box sx={{ position: "relative", height: 180 }}>
                    <CardMedia
                      component='img'
                      image={
                        it.images[0] ||
                        "https://via.placeholder.com/400x200?text=No+Image"
                      }
                      alt={it.title}
                      sx={{ height: "100%", objectFit: "cover" }}
                    />
                    <Chip
                      label={it.type}
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: "#34E0A1",
                        color: "white",
                        fontWeight: 600,
                        px: 1.5,
                      }}
                    />
                  </Box>

                  <CardContent>
                    <Typography variant='h6' fontWeight={700} gutterBottom>
                      {it.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' noWrap>
                      {it.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        mb: 1,
                      }}>
                      {(() => {
                        const rating = it.rating; // e.g., 1.3, 1.6, 2.2
                        let fullStars = 0;
                        let halfStars = 0;

                        // Custom logic
                        if (rating % 1 <= 0.35) {
                          fullStars = Math.floor(rating);
                          halfStars = 0;
                        } else if (rating % 1 <= 0.85) {
                          fullStars = Math.floor(rating);
                          halfStars = 1;
                        } else {
                          fullStars = Math.ceil(rating);
                          halfStars = 0;
                        }

                        const emptyStars = 5 - fullStars - halfStars;

                        return (
                          <>
                            {Array.from({ length: fullStars }).map((_, i) => (
                              <StarIcon
                                key={`full-${i}`}
                                sx={{ color: "#34E0A1" }}
                                fontSize='small'
                              />
                            ))}
                            {Array.from({ length: halfStars }).map((_, i) => (
                              <StarHalfIcon
                                key={`half-${i}`}
                                sx={{ color: "#34E0A1" }}
                                fontSize='small'
                              />
                            ))}
                            {Array.from({ length: emptyStars }).map((_, i) => (
                              <StarOutlineIcon
                                key={`empty-${i}`}
                                sx={{ color: "#34E0A1" }}
                                fontSize='small'
                              />
                            ))}
                          </>
                        );
                      })()}
                      <Box
                        component='span'
                        sx={{ ml: 0.5, fontSize: 12, color: "text.secondary" }}>
                        {it.rating.toFixed(1)}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}>
                      <Typography variant='caption' color='text.secondary'>
                        {it.city || "Unknown City"}
                      </Typography>
                      <Typography
                        variant='subtitle2'
                        sx={{ color: "#00AF87", fontWeight: 600 }}>
                        View Details →
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box display='flex' justifyContent='center' mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color='primary'
          />
        </Box>
      </Box>
    </Box>
  );
}
