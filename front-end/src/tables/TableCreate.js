import React, {useState} from 'react';
import { useHistory } from 'react-router';

//import components
import TableForm from './TableForm';
import ErrorAlert from '../layout/ErrorAlert';

//import utility functions

import {createTable} from "../utils/api";

export const TableCreate = () => {

    const history = useHistory();

    const initialFormState={
            table_name: '',
            capacity: '',
    }

    const [formData, setFormData] = useState({...initialFormState});
    const [error, setError] = useState(null);
    

    //cancel button handler
    function cancelHandler(){
        history.goBack();
    }

    //submit button handler

    function submitHandler(event){
        event.preventDefault();

        createTable(formData).then(()=>{
           history.push("/");
        })
        .catch(setError);
    }

    //form change handler

    function changeHandler({target: {name, value}}){
        setFormData((previousFormData) =>({
            ...previousFormData,
            [name]: value,
        }));
    }


  return (
    <main>
    <ErrorAlert error={error} />
      <TableForm
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
        formData={formData}
        changeHandler={changeHandler}
      />
    </main>
  );
}
