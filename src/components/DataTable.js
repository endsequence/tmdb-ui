import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import BookingForm from "./BookingForm";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { format, parseISO } from "date-fns";
import { updateBooking } from "../actions";

const DataTable = ({
  rows,
  page,
  totalResults,
  handleChangePage,
  handleRefreshBookingList,
}) => {
  const [result, setResult] = useState({});
  const [formOpen, setFormOpen] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState();
  const [toastMessage, setToastMessage] = useState();

  const handleFormOpen = (row) => {
    // console.log("In edit", row);
    setResult(row);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

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

  const handleCancelBooking = async (row) => {
    console.log({ row });
    const { payload, error } = await updateBooking({
      request: {
        id: row.id,
        status: false,
      },
    });
    if (payload) {
      updateToast("success", "Movie loaded!");
      handleRefreshBookingList();
    } else updateToast("error", "Something went wrong!");
  };

  return (
    <Container maxWidth="lg">
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
      <BookingForm
        formOpen={formOpen}
        handleFormClose={handleFormClose}
        emptyForm={false}
        booking={result}
        cb={handleRefreshBookingList}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>email</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Movie Name</TableCell>
              <TableCell align="right">Seats</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.email}
                </TableCell>
                <TableCell align="right">{row.firstName}</TableCell>
                <TableCell align="right">{row.lastName}</TableCell>
                <TableCell align="right">{row.movieName}</TableCell>
                <TableCell align="right">{row.seats}</TableCell>
                {row.date && (
                  <TableCell align="right">
                    {format(parseISO(row.date), "dd MMM yyyy")}
                  </TableCell>
                )}
                <TableCell align="right">
                  {row.status ? "OK" : "Canceled"}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleFormOpen(row)}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleCancelBooking(row)}
                    color="error"
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        // rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalResults}
        rowsPerPage={10}
        page={page}
        onPageChange={handleChangePage}
        // onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default DataTable;
