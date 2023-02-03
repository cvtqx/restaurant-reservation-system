import React, {useState} from 'react';
import {useHistory} from "react-router-dom";

//import utility functions
import {createReservation} from "../utils/api";

//import components
import ErrorAlert from "../layout/ErrorAlert";

const ReservationCreate = () => {

    const history = useHistory();

    const initialFormState ={
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    }

    const [reservation, setReservation] = useState({...initialFormState});
    const [error, setError] = useState(null);

    function cancelHandler(){
        history.goBack();
    }

    function submitHandler(event){
        event.preventDefault();
        createReservation(reservation)
        .then(()=>{
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setError);       
    }

    function changeHandler({target: {name, value}}){
        setReservation((previousReservation) =>({
            ...previousReservation,
            [name]: value,
        }))
    }

  return (
    <main>
      <h1 className="mb-3">Create Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label" htmlFor="first_name">
            {" "}
            First Name:
          </label>
          <input
            className="form-control"
            type="text"
            id="first_name"
            name="first_name"
            required={true}
            value={reservation.first_name}
            onChange={changeHandler}
            placeholder="Enter guest's first name..."
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="last_name">
            {" "}
            Last Name:
          </label>
          <input
            className="form-control"
            type="text"
            id="last_name"
            name="last_name"
            required={true}
            value={reservation.last_name}
            onChange={changeHandler}
            placeholder="Enter guest's last name..."
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="mobile_number">
            {" "}
            Phone number:
          </label>
          <input
            className="form-control"
            type="tel"
            id="mobile_number"
            name="mobile_number"
            required={true}
            value={reservation.mobile_number}
            onChange={changeHandler}
            placeholder="123-456-7890"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="reservation_date">
            {" "}
            Reservation date:
          </label>
          <input
            className="form-control"
            type="date"
            id="reservation_date"
            name="reservation_date"
            required={true}
            value={reservation.reservation_date}
            onChange={changeHandler}
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="reservation_time">
            {" "}
            Reservation time:
          </label>
          <input
            className="form-control"
            type="time"
            id="reservation_time"
            name="reservation_time"
            required={true}
            value={reservation.reservation_time}
            onChange={changeHandler}
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="people">
            {" "}
            Number of guests:
          </label>
          <input
            className="form-control"
            type="number"
            id="people"
            name="people"
            required={true}
            value={reservation.people}
            onChange={changeHandler}
            placeholder="How many guests"
            min="1"
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

export default ReservationCreate