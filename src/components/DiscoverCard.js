import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

const DiscoverCard = ({ result }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link to={`${result.id}`}>
          <CardMedia
            component="img"
            sx={{ height: "100%" }}
            image={`https://image.tmdb.org/t/p/w300${result.poster}`}
            alt={result.title}
          />
        </Link>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="overline" component="div">
            Rating: {result.rating}
          </Typography>
          {result.releaseDate && (
            <Typography variant="overline" component="div">
              Released: {format(parseISO(result.releaseDate), "MMM yyyy")}
            </Typography>
          )}
          <Typography gutterBottom variant="h6" component="div">
            {result.title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DiscoverCard;
