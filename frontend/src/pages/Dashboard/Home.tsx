import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HotelIcon from "@mui/icons-material/Hotel";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PeopleIcon from "@mui/icons-material/People";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { fetchStatistics } from "../../store/dashboard/statisticsSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data: stats, loading } = useAppSelector((state) => state.statistics);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    dispatch(fetchStatistics());
  }, []);

  if (loading || !stats)
    return (
      <Box display='flex' justifyContent='center' mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' fontWeight={700} mb={4}>
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <PeopleIcon sx={{ fontSize: 40, color: "#34E0A1", mr: 2 }} />
            <Box>
              <Typography variant='subtitle2'>Total Users</Typography>
              <Typography variant='h5' fontWeight={700}>
                {stats.totalUsers}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <BarChartIcon sx={{ fontSize: 40, color: "#00AF87", mr: 2 }} />
            <Box>
              <Typography variant='subtitle2'>Total Listings</Typography>
              <Typography variant='h5' fontWeight={700}>
                {stats.totalListings}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <RestaurantIcon sx={{ fontSize: 40, color: "#FF6B6B", mr: 2 }} />
            <Box>
              <Typography variant='subtitle2'>Restaurants</Typography>
              <Typography variant='h5' fontWeight={700}>
                {stats.restaurantCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <HotelIcon sx={{ fontSize: 40, color: "#4D96FF", mr: 2 }} />
            <Box>
              <Typography variant='subtitle2'>Hotels</Typography>
              <Typography variant='h5' fontWeight={700}>
                {stats.hotelCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <StorefrontIcon sx={{ fontSize: 40, color: "#FFC107", mr: 2 }} />
            <Box>
              <Typography variant='subtitle2'>Shops</Typography>
              <Typography variant='h5' fontWeight={700}>
                {stats.shopCount}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Optional: Chart */}
      {/* <Box mt={6}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Listings Statistics
        </Typography>
        <BarChart data={...} />
      </Box> */}

      {/* Monthly Stats */}
      <Typography variant='h5' mb={2}>
        Monthly Stats (This Year)
      </Typography>
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Listings per Month</Typography>
              <Bar
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: "Listings",
                      data: stats.monthly.listings,
                      backgroundColor: "#34E0A1",
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Users per Month</Typography>
              <Bar
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: "Users",
                      data: stats.monthly.users,
                      backgroundColor: "#00AF87",
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Yearly Stats */}
      <Typography variant='h5' mb={2}>
        Last 5 Years
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Listings per Year</Typography>
              <Line
                data={{
                  labels: stats.yearly.listings.map((x: any) => x.year),
                  datasets: [
                    {
                      label: "Listings",
                      data: stats.yearly.listings.map((x: any) => x.count),
                      borderColor: "#34E0A1",
                      backgroundColor: "#34E0A1",
                      tension: 0.3,
                      fill: true,
                      pointRadius: 5,
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Users per Year</Typography>
              <Line
                data={{
                  labels: stats.yearly.users.map((x: any) => x.year),
                  datasets: [
                    {
                      label: "Users",
                      data: stats.yearly.users.map((x: any) => x.count),
                      borderColor: "#00AF87",
                      backgroundColor: "#00AF87",
                      tension: 0.3,
                      fill: true,
                      pointRadius: 5,
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
