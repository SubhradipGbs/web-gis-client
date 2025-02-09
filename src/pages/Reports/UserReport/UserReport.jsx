import React from "react";
import { Table } from "react-bootstrap";
import { demoReports } from "../../../utils/constants";

const UserReport = () => {
  return (
    <div>
      <h3>User Log Report</h3>
      <Table
        size='sm'
        bordered
        hover
        responsive
        cellSpacing={5}
        cellPadding={15}>
        <thead className='table-active text-center'>
          <tr>
            <th className='px-4'>Sl No.</th>
            <th className='px-4'>UserId</th>
            <th className='px-4'>Username</th>
            <th className='px-4'>Type</th>
            <th className='px-4'>Timestamp</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {demoReports.map((item, index) => (
            <tr key={index}>
              <td className='px-4'>{index + 1}</td>
              <td className='px-4'>{item.userId}</td>
              <td className='px-4'>{item.username}</td>
              <td className='px-4'>{item.type}</td>
              <td className='px-4'>{item.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserReport;
