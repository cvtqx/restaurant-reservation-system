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

        try{
            const confirmation = window.confirm(
              "Is this table ready to seat new guests? This cannot be undone."
            );
            if (confirmation) {
              await finishTable(table.table_id);
              history.push("/");
              window.location.reload();
            }
        }catch(error){
            setError(error)
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