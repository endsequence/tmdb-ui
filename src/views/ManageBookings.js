import React, { useEffect, useState, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TitleBar from "../components/TitleBar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { getBookingList } from "../actions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DataTable from "../components/DataTable";
import TextField from "@mui/material/TextField";
import usePrevious from "../components/usePrevious";

const theme = createTheme();
const ManageBookings = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState();
  const [toastMessage, setToastMessage] = useState();

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const updateToast = (severity, message) => {
    setToastSeverity(severity);
    setToastMessage(message);
    setToastOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  const getBookings = async (searchQuery, page) => {
    const { payload, error } = await getBookingList({ searchQuery, page });
    if (payload) {
      setLoading(false);
      updateToast("success", "Bookings loaded!");
      setResults(payload.results);
      setTotalResults(payload.totalResults);
    } else updateToast("error", "Something went wrong!");
  };

  useEffect(() => {
    setLoading(true);
    getBookings(searchQuery, page);
  }, []);

  const handleChangePage = (event, number) => {
    // console.log({ event, number });
    setPage(number);
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
    if (!isMount) {
      //   console.log({ searchQueryRef, pageRef });
      const searchQueryChanged = searchQueryRef !== searchQuery;
      if (searchQueryChanged) {
        const timeOutId = setTimeout(() => {
          console.log("searchQuery invoke", searchQuery, page);
          setLoading(true);
          getBookings(searchQuery, 0);
        }, 1000);
        return () => clearTimeout(timeOutId);
      } else {
        console.log("page invoke", searchQuery, page);
        setLoading(true);
        getBookings(searchQuery, page);
      }
    }
  }, [searchQuery, page]);

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleRefreshBookingList = () => {
    getBookings(searchQuery, page);
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
        text={`Admin Panel \\ Bookings List`}
        link={"/discover"}
        linkText={"Discover Movies"}
      />
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 5,
            pb: 5,
          }}
        >
          <Container maxWidth="lg" sx={{ my: 2 }}>
            <TextField
              label="Search"
              value={searchQuery || ""}
              onChange={(e) => handleSearchQuery(e.target.value)}
            />
          </Container>

          {loading && (
            <Container maxWidth="lg" sx={{ mt: 5 }}>
              <LinearProgress />
            </Container>
          )}

          {!loading && (
            <DataTable
              rows={results}
              page={page}
              totalResults={totalResults}
              handleChangePage={handleChangePage}
              handleRefreshBookingList={handleRefreshBookingList}
            />
          )}
        </Box>
      </main>
    </ThemeProvider>
  );
};

export default ManageBookings;
