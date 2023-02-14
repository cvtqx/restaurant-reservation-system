import React, { useEffect, useState } from "react";
import {useHistory, useRouteMatch} from "react-router-dom";

//import utility functions
import { listReservations, listTables } from "../utils/api";
import  useQuery  from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";

//import components
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  const history = useHistory();
  const query = useQuery();
  const route = useRouteMatch();
 

  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);

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

//update date state
  useEffect(() =>{

    function getDate(){
      const getQueryDate = query.get("date");

      if(getQueryDate){
        setCurrentDate(getQueryDate)
      }else{
        setCurrentDate(today())
      }
    }
    getDate();
    
  }, [query, route])

  //load tables
  useEffect(() =>{

    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
    .then(setTables)
    .catch(setTablesError);
    return() => abortController.abort();

  }, [])
  

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
            history.push(`/dashboard?date=${previous(currentDate)}`);
            setCurrentDate(previous(currentDate));
          }}
        >
          Previous day
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            history.push(`/dashboard?date=${today(currentDate)}`);
            setCurrentDate(today(currentDate));
          }}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            history.push(`/dashboard?date=${next(currentDate)}`);
            setCurrentDate(next(currentDate));
          }}
        >
          Next day
        </button>
      </div>

      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {currentDate}</h4>
      </div>

      <ErrorAlert error={reservationsError} />
      
      <ReservationsList reservations={reservations} date={currentDate}/>

      <TablesList  tables={tables} error={tablesError} />
    </main>
  );
}

export default Dashboard;
