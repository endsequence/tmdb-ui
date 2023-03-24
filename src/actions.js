import axios from "axios";
import { SERVER_HOST } from "./constants";
export async function getMovieList({ searchQuery, page }) {
  try {
    let url = SERVER_HOST + "/api/movie/list/page/" + page;
    if (searchQuery) url = url + "/" + searchQuery;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("result", result.data);
    const { status, statusMsg, payload = {} } = (result && result.data) || {};
    if (status === "OK") {
      return { payload };
    } else {
      return { error: statusMsg };
    }
  } catch (e) {
    return { error: e.message };
  }
}

export async function getMovieDetail({ id }) {
  try {
    const url = SERVER_HOST + "/api/movie/detail/" + id;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("result", result.data);
    const { status, statusMsg, payload = {} } = (result && result.data) || {};
    if (status === "OK") {
      return { payload };
    } else {
      return { error: statusMsg };
    }
  } catch (e) {
    return { error: e.message };
  }
}

export async function getMovieReviews({ id }) {
  try {
    const url = SERVER_HOST + "/api/movie/review/" + id;
    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("result", result.data);
    const { status, statusMsg, payload = {} } = (result && result.data) || {};
    if (status === "OK") {
      return { payload };
    } else {
      return { error: statusMsg };
    }
  } catch (e) {
    return { error: e.message };
  }
}

export async function createBooking({ request }) {
  try {
    const url = SERVER_HOST + "/api/booking";
    const result = await axios.post(url, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("result", result.data);
    const { status, statusMsg, payload = {} } = (result && result.data) || {};
    if (status === "OK") {
      return { payload };
    } else {
      return { error: statusMsg };
    }
  } catch (e) {
    return { error: e.message };
  }
}

export async function updateBooking({ request }) {
  try {
    const url = SERVER_HOST + "/api/booking/" + request.id;
    const result = await axios.put(url, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("result", result.data);
    const { status, statusMsg, payload = {} } = (result && result.data) || {};
    if (status === "OK") {
      return { payload };
    } else {
      return { error: statusMsg };
    }
  } catch (e) {
    return { error: e.message };
  }
}

export async function getBookingList({ searchQuery, page }) {
  try {
    let url = SERVER_HOST + `/api/booking/list?offset=${page}&pageSize=10`;
    if (searchQuery) url = url + `&query=${searchQuery}`;

    const result = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("result", result.data);
    const { status, statusMsg, payload = {} } = (result && result.data) || {};
    if (status === "OK") {
      return { payload };
    } else {
      return { error: statusMsg };
    }
  } catch (e) {
    console.log("error", e.message);
    return { error: e.message };
  }
}
