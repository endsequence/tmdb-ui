import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { getMovieDetail, getMovieReviews } from "../actions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Reviews from "../components/Reviews";
import BookingForm from "../components/BookingForm";
import { format, parseISO } from "date-fns";

const theme = createTheme();
export default function Detail(props) {
  const { id } = useParams();
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});
  const [reviews, setReviews] = useState([]);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState();
  const [toastMessage, setToastMessage] = useState();

  const [formOpen, setFormOpen] = useState(false);

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const getMovie = async () => {
    const { payload, error } = await getMovieDetail({ id });
    // console.log({ payload, error });
    if (payload) {
      setLoading(false);
      updateToast("success", "Movie loaded!");
      setResult(payload);
    } else {
      updateToast("error", "Something went wrong!");
    }
  };

  const getReviews = async () => {
    const { payload, error } = await getMovieReviews({ id });
    // console.log({ payload, error });
    if (payload) {
      setReviews(payload.results);
    }
  };

  const updateToast = (severity, message) => {
    setToastSeverity(severity);
    setToastMessage(message);
    setToastOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    getMovie();
    getReviews();
  }, []);

  const handleBack = () => {
    navigate("/discover");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BookingForm
        formOpen={formOpen}
        handleFormClose={handleFormClose}
        emptyForm={true}
        movie={result}
      />
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toastSeverity}
          lg={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
      <TitleBar
        text={`Discover Movies \\ Explore exciting movie titles. Have fun :)`}
        link={"/manage"}
        linkText={"Manage Bookings"}
      />
      <main>
        {loading && (
          <Container maxWidth="lg" sx={{ mt: 5 }}>
            <LinearProgress />
          </Container>
        )}

        {!loading && (
          <Container sx={{ py: 8 }} maxWidth="sm">
            <CardActions>
              <Button size="small" variant="outlined" onClick={handleBack}>
                Go back
              </Button>
              <Button size="small" variant="contained" onClick={handleFormOpen}>
                Make a booking
              </Button>
            </CardActions>
            <Grid container spacing={4} sx={{ my: 2 }}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {result.poster && (
                    <CardMedia
                      component="img"
                      sx={{ height: "100%" }}
                      image={`https://image.tmdb.org/t/p/w300${result.poster}`}
                      alt={result.title}
                    />
                  )}
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Typography gutterBottom variant="h5" component="h2">
                  {result.title}
                </Typography>
                <Typography
                  gutterBottom
                  variant="button"
                  component="div"
                  color="primary"
                >
                  Genres: {(result.genres || []).join(", ")}
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                  {result.overview}
                </Typography>
                <Typography gutterBottom variant="button" component="div">
                  Rating: {result.rating}
                </Typography>
                {result.releaseDate && (
                  <Typography gutterBottom variant="body2" component="div">
                    Released:
                    {format(parseISO(result.releaseDate), "dd MMM yyyy")}
                  </Typography>
                )}
                <Typography gutterBottom variant="body2" component="div">
                  Total reviews: {result.voteCount}
                </Typography>
              </Grid>
            </Grid>

            <Reviews reviews={reviews} />
          </Container>
        )}
      </main>
    </ThemeProvider>
  );
}
