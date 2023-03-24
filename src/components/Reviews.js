import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Reviews = ({ reviews }) => {
  return (
    <>
      {reviews.map((review, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{review.author}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{review.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default Reviews;
