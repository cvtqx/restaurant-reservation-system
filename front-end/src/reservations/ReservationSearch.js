import React, {useState} from 'react'


//import utility functions
import { searchReservations } from '../utils/api';

//import components
import ErrorAlert from '../layout/ErrorAlert';
import ReservationsList from './ReservationsList';

const ReservationSearch = () => {
     
    const [inputData, setInputData] = useState({mobile_number: ""});
    const [error, setError] = useState(null);
    const [reservations, setReservations] = useState([]);

    const submitHandler = async(event) =>{
        event.preventDefault();
        setError(null);
        

        const abortController = new AbortController();
        try{
            const response = await searchReservations(inputData, abortController.signal);
            
            setReservations( response);
            setInputData({ mobile_number: "" });    

        }catch(error){
            setError(error)
        }
        return () => abortController.abort();
    }

     const changeHandler = (event) =>setInputData(event.target.value);

     
     

  return (
    <main>
    <h4>Search for a reservation</h4>
    <ErrorAlert error={error} />
    <form onSubmit={submitHandler}>
      <div className="input-group mb-3">
        <input
          type="tel"
          className="form-control"
          name="mobile_number"
          placeholder="Enter customer's phone number"
          aria-label="mobile_number"
          aria-describedby="basic-addon2"
          required={true}
          value={inputData.mobile_number}
          onChange={changeHandler}
        />
        <button className="btn btn-primary" id="basic-addon2" type="submit">
          Find
        </button>
      </div>
    </form>
    <h4>Search Result</h4>
    {reservations.length > 0 ?
    (<ReservationsList reservations={reservations} />):
    "No reservations found"
    }
    </main>
  );

}

export default ReservationSearch