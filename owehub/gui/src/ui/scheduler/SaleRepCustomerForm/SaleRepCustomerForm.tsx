import React from 'react'
import styles from './styles/index.module.css'
import Input from './component/Input/Input'

const SaleRepCustomerForm = () => {
    return (
        <div className={`py4 ${styles.form_wrapper}`}>
            <div className={styles.form_conatiner}>
                <div className={` flex items-center justify-center ${styles.form_header}`}>
                    <div>
                        <h3>Customer Information</h3>
                        <p>
                            Change the customer information if incorrect
                        </p>
                    </div>
                </div>
                <div className={`${styles.form_content} py3`}>
                    <div className='mb2'>
                        <Input label='Prospect ID' value={"48594"} />
                    </div>

                    <div className='mb2'>
                        <Input label='Name' value={"Peter Parket"} />
                    </div>
                    <div className='mb2'>
                        <Input label='Phone no.' value={"983 4785 9298"} />
                    </div>

                    <div className='mb2'>
                        <Input label='Email' value={"john@gmail.com"} />
                    </div>

                    <div className='mb2'>
                        <Input label='Email' value={"103, avenue street, Colorado, 267531"} />
                    </div>

                    <div className=''>
                        <Input showIsEditing={false} label='Sales Rep' value={"Ajay Negi"} />
                    </div>




                </div>

                <div className='bg-white mt3' >
                    <p style={{fontSize:12 }} className='text-center mb2'>Make sure all the information is correct before confirming</p>
                    <button className={` mx-auto  ${styles.submit_btn}`}>Confirm</button>
                </div>
            </div>

        </div>
    )
}

export default SaleRepCustomerForm