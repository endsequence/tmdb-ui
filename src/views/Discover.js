import React, { useEffect, useState, useRef } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getMovieList } from "../actions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import LinearProgress from "@mui/material/LinearProgress";
import TitleBar from "../components/TitleBar";
import DiscoverCard from "../components/DiscoverCard";
import Footer from "../components/Footer";
import usePrevious from "../components/usePrevious";

const theme = createTheme();
export default function Discover() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState();
  const [toastMessage, setToastMessage] = useState();

  const [searchQuery, setSearchQuery] = useState("");

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (results.length > 0) {
      const newOptions = results.map((el) => {
        return { title: el.title, label: el.title };
      });
      setOptions(newOptions);
    }
  }, [results]);

  const getMovies = async (searchQuery, page) => {
    const { payload, error } = await getMovieList({ searchQuery, page });
    if (payload) {
      setLoading(false);
      updateToast("success", "Movies loaded!");
      setResults(payload.results);
    } else updateToast("error", "Something went wrong!");
  };

  const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };
  const isMount = useIsMount();

  const searchQueryRef = usePrevious(searchQuery);
  useEffect(() => {
    // console.log("searchQuery invoke", searchQuery, page);
    if (!isMount) {
      const searchQueryChanged = searchQueryRef !== searchQuery;
      if (searchQueryChanged) {
        const timeOutId = setTimeout(() => {
          setLoading(true);
          getMovies(searchQuery, 1);
        }, 1000);
        return () => clearTimeout(timeOutId);
      } else {
        setLoading(true);
        getMovies(searchQuery, page);
      }
    }
  }, [searchQuery, page]);

  useEffect(() => {
    setLoading(true);
    getMovies(searchQuery, page);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const updateToast = (severity, message) => {
    setToastSeverity(severity);
    setToastMessage(message);
    setToastOpen(true);
  };

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 5,
            pb: 5,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ my: 2 }}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  id="free-solo-demo"
                  freeSolo
                  options={options}
                  inputValue={searchQuery}
                  onInputChange={(event, newInputValue) => {
                    handleSearchQuery(newInputValue);
                  }}
                  renderInput={(params) => {
                    const InputProps = { ...params.InputProps };
                    InputProps.endAdornment = null;
                    return (
                      <TextField
                        {...params}
                        InputProps={InputProps}
                        label="Search"
                        value={searchQuery || ""}
                        onChange={(e) => handleSearchQuery(e.target.value)}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Pagination
                  count={1000}
                  page={page}
                  shape="rounded"
                  size="large"
                  onChange={(event, Number) => {
                    setPage(Number);
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {loading && (
          <Container maxWidth="lg" sx={{ mt: 5 }}>
            <LinearProgress />
          </Container>
        )}

        {!loading && (
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {results.map((result, index) => (
                <DiscoverCard result={result} key={index} />
              ))}
            </Grid>
          </Container>
        )}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
