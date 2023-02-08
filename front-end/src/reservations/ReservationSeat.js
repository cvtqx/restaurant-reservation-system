import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";

//import components
import ErrorAlert from "../layout/ErrorAlert";

//import utility functions
import { listTables, seatReservation } from "../utils/api";


const ReservationSeat = () => {

  const { reservation_id } = useParams();
  const history = useHistory();

  const [formData, setFormData] = useState("");
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);


  //load tables
  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }, [reservation_id]);




  const submitHandler = async(event) => {

    event.preventDefault();
    setError(null);
    const abortController = new AbortController();
    const tableId = Number(formData.table_id);
    const reservationId = Number(reservation_id);

    try{
        await seatReservation(tableId, reservationId, abortController.signal)
        history.push("/");
    } catch(error){ 
        setError(error)
    }
    return () => abortController.abort();  
  };


  //form change handler

  const changeHandler = ({ target: { name, value } }) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler}>
        <h4>Seat reservation number {reservation_id}</h4>
        <label htmlFor="table_id">Table number:</label>
        <select
          id="table_id"
          name="table_id"
          onChange={changeHandler}
          value={formData.table_id}
        >
          <option value="">Select a table</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
          
        </select>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationSeat