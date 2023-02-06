import React from 'react'

const TableForm = ({ submitHandler, cancelHandler, changeHandler, formData }) => {
  return (
    <form onSubmit={submitHandler}>
        <h4>Create new table</h4>
      <div className="mb-3">
        <label htmlFor="table_name"> Table name</label>
        <input
          name="table_name"
          id="table_name"
          type="text"
          required={true}
          value={formData.table_name}
          onChange={changeHandler}
          placeholder="Table name"
          minLength={2}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="capacity">Capacity</label>
        <input
          name="capacity"
          id="capacity"
          type="number"
          required={true}
          value={formData.capacity}
          onChange={changeHandler}
          placeholder="1"
          min={1}
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
  );
};

export default TableForm