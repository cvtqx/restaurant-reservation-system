import React, { useState } from "react";
import { useHistory} from 'react-router';

//import components
import ErrorAlert from '../layout/ErrorAlert';

//import utility functions
import {finishTable} from "../utils/api";

const TableFinish = ({table}) => {

    const history = useHistory();
    const [error, setError] = useState(null);

    const clickHandler = async(event)=>{
        event.preventDefault();
        setError(null);
        
        const abortController = new AbortController();

        
            const confirmation = window.confirm(
              "Is this table ready to seat new guests? This cannot be undone."
            );
            if (confirmation) {
              try{
              await finishTable(table.table_id, abortController.signal);
              //TO DO : refresh the list of tables - not sure about this one - test does not pass
              history.push("/"); 
              }
              catch(error){
                setError(error)
              }             
            }      
       return () => abortController.abort();
    }
      
    

  return (
    table.reservation_id && (
      <div>
        <ErrorAlert error={error} />
        <button className="btn btn-danger" type="button" onClick={clickHandler}>
          Finish
        </button>
      </div>
    )
  );
  
}

export default TableFinish