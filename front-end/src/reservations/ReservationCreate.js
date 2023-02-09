import React, {useState} from 'react';
import {useHistory} from "react-router-dom";

//import utility functions
import {createReservation} from "../utils/api";

//import components
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from './ReservationForm';

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

    const submitHandler = async(event) => {

        event.preventDefault();
        setError(null);
      
        const abortController = new AbortController();
        reservation.people = Number(reservation.people);
        
        try{
          const response = await createReservation(reservation, abortController.signal);
          //console.log(response)
          history.push(`/dashboard?date=${response.reservation_date}`);
        }
        catch(error){
          //console.log(error)
            setError(error)          
        }
        return ()=> abortController.abort();
              
    }

    function changeHandler({target: {name, value}}){
        setReservation((previousReservation) =>({
            ...previousReservation,
            [name]: value,
        }))
    }

  return (
    <>
      <h1 className="mb-3">Create Reservation</h1>
      <ErrorAlert error={error} />
      <ReservationForm
        reservation={reservation}
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        cancelHandler={cancelHandler}
      />
    </>
  );
}

export default ReservationCreate