import React, { useEffect, useState } from "react";
import {useHistory, useRouteMatch} from "react-router-dom";

//import utility functions
import { listReservations } from "../utils/api";
import  useQuery  from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";

//import components
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  const history = useHistory();
  const query = useQuery();
 

  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);


  useEffect(loadDashboard, [currentDate]);

  //load reservations for current date
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }


  


  return (
    <main>
      <h1>Dashboard</h1>

      <div
        className="btn-group"
        role="group"
        aria-label="Basic outlined example"
      >
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            history.push(`/dashboard?date=${previous(date)}`);
            setCurrentDate(previous(date));
          }}
        >
          Previous day
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            history.push(`/dashboard?date=${today(date)}`);
            setCurrentDate(today(date));
          }}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            history.push(`/dashboard?date=${next(date)}`);
            setCurrentDate(next(date));
          }}
        >
          Next day
        </button>
      </div>

      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{`Reservations for ${date}`}</h4>
      </div>

      <ErrorAlert error={reservationsError} />

      <ReservationsList reservations={reservations} />
    </main>
  );
}

export default Dashboard;
