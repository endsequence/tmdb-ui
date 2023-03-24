import React, { useEffect, useState } from "react";
import Box from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { createBooking, updateBooking } from "../actions";

const BookingForm = ({
  formOpen,
  handleFormClose,
  emptyForm,
  movie,
  booking,
  cb = () => {},
}) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState();
  const [toastMessage, setToastMessage] = useState();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    seats: "",
    date: new Date(),
  });

  useEffect(() => {
    console.log({ emptyForm, booking });
    if (!emptyForm && booking) {
      setFormData({
        email: booking.email,
        firstName: booking.firstName,
        lastName: booking.lastName,
        seats: booking.seats,
        date: booking.date,
      });
    }
  }, [emptyForm, booking]);

  const handleFormSubmit = async () => {
    // console.log({ formData });
    let resp;
    if (booking?.id) {
      resp = await updateBooking({
        request: {
          id: booking.id,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      });
    } else {
      resp = await createBooking({
        request: { ...formData, movieId: movie.id, movieName: movie.title },
      });
    }
    if (resp?.payload) {
      updateToast("success", "Booking saved successfully!");
      handleFormClose();
      cb();
    } else {
      updateToast("error", resp?.error);
    }
  };

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
      <Dialog open={formOpen} onClose={handleFormClose}>
        <DialogTitle>Booking Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={(event) =>
              setFormData({ ...formData, email: event.target.value })
            }
          />
          <TextField
            autoFocus
            margin="dense"
            id="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.firstName}
            onChange={(event) =>
              setFormData({ ...formData, firstName: event.target.value })
            }
          />
          <TextField
            autoFocus
            margin="dense"
            id="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.lastName}
            onChange={(event) =>
              setFormData({ ...formData, lastName: event.target.value })
            }
          />
          <TextField
            autoFocus
            margin="dense"
            id="seats"
            label="Seats"
            type="number"
            fullWidth
            variant="standard"
            value={formData.seats}
            onChange={(event) =>
              setFormData({ ...formData, seats: event.target.value })
            }
            disabled={booking?.id !== undefined}
          />
          {booking?.movieName && (
            <TextField
              autoFocus
              margin="dense"
              id="movieName"
              label="Movie Name"
              type="text"
              fullWidth
              variant="standard"
              value={booking.movieName}
              disabled
            />
          )}
          <Box sx={{ mt: 2 }}>
            <DesktopDatePicker
              label="Choose Date"
              inputFormat="MM/dd/yyyy"
              value={formData.date}
              //   onChange={handleChange}
              onChange={(value) => setFormData({ ...formData, date: value })}
              renderInput={(params) => <TextField {...params} />}
              disabled={booking?.id !== undefined}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>submit</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default BookingForm;
