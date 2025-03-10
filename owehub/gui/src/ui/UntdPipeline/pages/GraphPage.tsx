import React from 'react'
import styles from '../styles/graphpage.module.css'
import SmallBars from '../components/SmallBars';

const GraphPage = () => {
    return (
        <div className={styles.dashboard}>
            <div className={styles.mainview}>
                <div className={styles.topview}>
                    <div className={styles.topleftview}>
                        <div className={styles.headerright}>
                            <h1>Total Project- 2025</h1>
                        </div>

                        <div className={styles.projstatus}>
                            <h3>Total Projects Sold</h3>
                            <h1>1753</h1>
                            <SmallBars fill='red'/>
                        </div>
                    </div>
                    <div className={styles.toprightview}>

                    </div>
                </div>
                <div className={styles.bottomview}></div>
            </div>
        </div>
    )
}

export default GraphPage;
