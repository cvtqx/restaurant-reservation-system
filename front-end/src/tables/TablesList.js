import React from 'react'


const TablesList = ({tables}) => {

    const tableRows = tables.map((table) =>(
        <tr key ={table.table_id}>
            <th scope ="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
        </tr>
    ))


  return (
    <main>
      <div>Tables List</div>
      <table className="table">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Table name</th>
                <th scope="col">Capacity</th>
            </tr>
        </thead>
        <tbody>
            {tableRows}
        </tbody>
      </table>
    </main>
  );
}

export default TablesList