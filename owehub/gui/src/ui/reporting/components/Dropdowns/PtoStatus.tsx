import React, { useState } from 'react'
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

const PTOStatus = () => {
    const [selectedStatus, setSelectedStatus] = useState<Option[]>([]);

    return (
        <div>
            <DropdownCheckBox
                label={selectedStatus.length === 1 ? 'PTO Status' : 'PTO Status'}
                placeholder={'Search PTO Status'}
                selectedOptions={selectedStatus}
                options={[
                    { label: 'Submitted / Scheduled', value: 'Submitted / Scheduled' },
                    { label: 'Resubmitted / Rescheduled', value: 'Resubmitted / Rescheduled' },
                    { label: 'Redlined - Field Work Required', value: 'Redlined - Field Work Required' },
                    { label: 'Ready for Resubmission', value: 'Ready for Resubmission' },
                    { label: 'REDLINED', value: 'REDLINED' },
                    { label: 'Pending Submission - Utility', value: 'Pending Submission - Utility' },
                    { label: 'Pending PTO Letter from Utility', value: 'Pending PTO Letter from Utility' },
                    { label: 'Pending Labels / Fieldwork / CAD / Photos', value: 'Pending Labels / Fieldwork / CAD / Photos' },
                    { label: 'Pending IC', value: 'Pending IC' },
                    { label: 'Pending Grid profile from Tesla NM', value: 'Pending Grid profile from Tesla NM' },
                    { label: 'Pending FIN tag / Clearance / Inspection result', value: 'Pending FIN tag / Clearance / Inspection result' },
                    { label: 'Pending Documents', value: 'Pending Documents' },
                    { label: 'PTO!', value: 'PTO!' },
                    { label: 'Not Ready for PTO Yet', value: 'Not Ready for PTO Yet' },
                    { label: 'Needs Review', value: 'Needs Review' },
                    { label: 'NEW Utility - Working with utility', value: 'NEW Utility - Working with utility' },
                    { label: 'DUPLICATE', value: 'DUPLICATE' },
                    { label: 'CANCELLED', value: 'CANCELLED' },
                    { label: 'AHJ Redlined - Send to RAT', value: 'AHJ Redlined - Send to RAT' },
                    { label: 'null', value: 'null' }
                ]}
                onChange={(val) => {
                    setSelectedStatus(val);
                }}
            />
        </div>
    )
}

export default PTOStatus;
