import React from 'react'
import TableHeaderLayout from '../../../components/tableHeader/TableHeaderLayout'


const PaymentSchedule = () => {
    const paymentData = [
        {
          pn: "Gray Horse Group",
          pat: "Concert",
          inst: "OWE",
          saletype:"Loan",
          ST:"AZ",
          rl: "$40.00",
          draw: "50%",
          dm:"$2000.00",
          rw:"$2000.00",
          rmw:"$2000.00",
          rp:"$2000.00"
    
        },
        {
            pn: "Gray Horse Group",
            pat: "Concert",
            inst: "OWE",
            saletype:"Loan",
            ST:"AZ",
            rl: "$40.00",
            draw: "50%",
            dm:"$2000.00",
            rw:"$2000.00",
            rmw:"$2000.00",
            rp:"$2000.00"
      
          },
          {
            pn: "Gray Horse Group",
            pat: "Concert",
            inst: "OWE",
            saletype:"Loan",
            ST:"AZ",
            rl: "$40.00",
            draw: "50%",
            dm:"$2000.00",
            rw:"$2000.00",
            rmw:"$2000.00",
            rp:"$2000.00"
      
          },
          {
            pn: "Gray Horse Group",
            pat: "Concert",
            inst: "OWE",
            saletype:"Loan",
            ST:"AZ",
            rl: "$40.00",
            draw: "50%",
            dm:"$2000.00",
            rw:"$2000.00",
            rmw:"$2000.00",
            rp:"$2000.00"
      
          },
        
      ]

  return (
    <>
<div className='comm'>
      <div className='commissionContainer'>
        <TableHeaderLayout />
        <div className='TableContainer'>
          <table>
        
            <thead >
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className='check-box' />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Partner Name</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Partner</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sale Type</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>ST</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate List</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw %</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw Max</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Draw %</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Max Draw %</p> 
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Pay</p> 
                  </div>
                </th>
            
              </tr>
            </thead>
            <tbody >
              {
                paymentData.map((el, i) => (
                  <tr key={i}>
                    <td ><input value="test" type="checkbox" className='check-box' /></td>
                    <td style={{ fontWeight: "600" }}>{el.pn}</td>
                    <td>{el.pat}</td>
                    <td>{el.inst}</td>
                    <td>{el.saletype}</td>
                    <td>{el.ST}</td>
                    <td>{el.rl}</td>
                    <td>{el.draw}</td>
                    <td>{el.dm}</td>
                    <td>{el.rw}</td>
                    <td>{el.rmw}</td>
                    <td>{el.rp}</td>
                   
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>
      </div>
    </div>
</>
  )
}

export default PaymentSchedule