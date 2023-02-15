import React from 'react';
import TableFinish from './TableFinish';


const TablesList = ({tables}) => {

    const tableRows = tables.map((table) => (
      <tr key={table.table_id}>
        <th scope="row">{table.table_id}</th>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id === null ? "Free" : "Occupied"}
        </td>
        <td data-table-id-finish={table.table_id}>
          <TableFinish table={table} />
        </td>
      </tr>
    ));


  return (
    <div className="container">
      <h4 className="text-center">Tables</h4>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Table name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Table status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </div>
  );
}

export default TablesList