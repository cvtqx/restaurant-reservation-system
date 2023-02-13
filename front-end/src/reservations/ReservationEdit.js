import React, {useState, useEffect} from 'react';
import { useHistory, useParams } from 'react-router';

//import utility functions

import { readReservation, updateReservation } from '../utils/api';

//import components

import ReservationForm from './ReservationForm';
import ErrorAlert from '../layout/ErrorAlert';

const ReservationEdit = () => {

  const history = useHistory();

  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState([]);
  const [error, setError] = useState(null);

  //load reservation

  useEffect(() => {
    

    async function loadReservation() {
     
        const loadedReservation = await readReservation(reservation_id);
        setReservation(loadedReservation);
    }
    loadReservation();
  }, [reservation_id]);




  const changeHandler =({target}) =>{
    setReservation({
        ...reservation,
        [target.name]: target.value
    })
  };


const submitHandler = async(event) =>{
    event.preventDefault();

    setError(null);

    const abortController = new AbortController();
    reservation.people = Number(reservation.people);

    try{
        const response = await updateReservation(reservation, abortController.signal);
        history.push(`/dashboard?date=${response.reservation_date}`);
    }
    catch(error){
        setError(error)
    }
    return () => abortController.abort();
}


const cancelHandler = ()=>{
    history.goBack();
}

 
  return (
    <div>
      <h4>Edit reservation {reservation.reservation_id}</h4>
      <ErrorAlert error={error} />
      <ReservationForm
        reservation={reservation}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
      />
    </div>
  );
}

export default ReservationEdit