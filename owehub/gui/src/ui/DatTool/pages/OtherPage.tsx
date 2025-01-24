import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Select from '../components/Select';
import DisplaySelect from '../components/DisplaySelect';

interface Styles {
  [key: string]: React.CSSProperties;
}

const styles: Styles = {
  cardStyle: {
    backgroundColor: 'white',
    borderRadius: '28px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    width: '100%',
  },
  sectionHeaderStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  titleStyle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  editButtonStyle: {
    color: '#434343',
    background: '#FAFAFF',
    borderRadius:'50%',
    fontSize:10,
    height: 30,
    width: 30,
    paddingTop:5,
    border: 'none',
    cursor: 'pointer',
  },
  actionButtonsStyle: {
    display: 'flex',
    gap: '8px',
  },
  saveButtonStyle: {
    background: '#377CF6',
    borderRadius:'50%',
    fontSize:10,
    height: 30,
    width: 30,
    paddingTop:5,
    border: 'none',
    cursor: 'pointer',
    color: '#FFF',
  },
  cancelButtonStyle: {
    background: '#FAFAFF',
    borderRadius:'50%',
    fontSize:10,
    height: 30,
    width: 30,
    paddingTop:5,
    border: 'none',
    cursor: 'pointer',
    color: '#293540',
  },
  labelStyle : {
    marginBottom: '5px',
    fontSize:'12px',
    fontWeight:'400',
    lineHeight:'18px',
    color:'#565656'
  },
  gridStyle: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  fieldGroupStyle: {
    // marginBottom: '16px',
  },
  valueStyle: {
    fontSize: '12px',
    color: '#333',
    display: 'flex',
    gap: '50px',
  },
  inputStyle: {
    width: '100%',
    padding: '4px 8px',
    fontSize: '12px',
    border: '0px',
    borderRadius: '28px',
    color: '#333',
    lineHeight:'18px',
    fontFamily:'poppins',
    minHeight: '36px',
    backgroundColor:'#F5F5FD'
  },
};

interface MPPTValue {
  'S.1': string;
  'S.2': string;
}

interface Fields {
  [key: string]: string | MPPTValue;
}

interface FieldConfig {
  type: 'select' | 'input';
  options?: string[];
}

interface CardProps {
  title: string;
  fields: Fields;
  onSave: (fields: Fields) => void;
  fieldConfigs?: { [key: string]: FieldConfig };
  customGrid?: (
    isEditing: boolean,
    editedFields: Fields,
    handleFieldChange: (key: string, value: string | MPPTValue) => void,
    handleEdit: () => void,
    handleCancel: () => void
  ) => React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, fields, onSave, fieldConfigs = {}, customGrid }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedFields, setEditedFields] = useState<Fields>(fields);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedFields);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedFields(fields);
    setIsEditing(false);
  };

  const handleFieldChange = (key: string, value: string | MPPTValue) => {
    setEditedFields({
      ...editedFields,
      [key]: value
    });
  };

  if (customGrid) {
    return customGrid(isEditing, editedFields, handleFieldChange, handleEdit, handleCancel) as JSX.Element;
  }

  const renderField = (key: string, value: string | MPPTValue) => {
    const config = fieldConfigs[key] || { type: 'input' };

    if (isEditing) {
      if (config.type === 'select' && config.options) {
        const selectOptions = config.options.map(option => ({
          value: option,
          label: option
        }));

        return (
          <Select
            label={key}
            options={selectOptions}
            value={value as string}
            onChange={(newValue) => handleFieldChange(key, newValue as string)}
          />
        );
      }
      return (
        <div>
        <label style={styles.labelStyle}>{key}</label>
        <input
          style={styles.inputStyle}
          value={value as string}
          onChange={(e) => handleFieldChange(key, e.target.value)}
        />
      </div>
      );
    }

    return (
      <DisplaySelect 
        label={key} 
        value={typeof value === 'object' ? `S.1: ${value['S.1']}, S.2: ${value['S.2']}` : value || '---'} 
      />
    );
  };

  return (
    <div style={styles.cardStyle}>
      <div style={styles.sectionHeaderStyle}>
        <h2 style={styles.titleStyle}>{title}</h2>
        {isEditing ? (
          <div style={styles.actionButtonsStyle}>
            <button style={styles.cancelButtonStyle} onClick={handleCancel}>
              <AiOutlineClose size={15} />
            </button>
            <button style={styles.saveButtonStyle} onClick={handleSave}>
              <AiOutlineCheck size={15} />
            </button>
          </div>
        ) : (
          <button style={styles.editButtonStyle} onClick={handleEdit}>
            <AiOutlineEdit size={15}/>
          </button>
        )}
      </div>
      <div style={styles.gridStyle}>
        {Object.entries(fields).map(([key, value]) => (
          <div key={key} style={styles.fieldGroupStyle}>
            {renderField(key, value)}
          </div>
        ))}
      </div>
    </div>
  );
};

function OtherPage() {
  const electricalEquipmentConfig: { [key: string]: FieldConfig } = {
    'New Or Existing': { type: 'select' as const, options: ['New', 'Existing'] },
    'Busbar Rating': { type: 'select' as const, options: ['200'] },
    'Panel Brand': { type: 'select' as const, options: ['Lelon', 'Eaton'] },
    'Main Breaker Rating': { type: 'select' as const, options: ['200'] },
  };

  const electricalSystemConfig = {
    'System Phase': { type: 'select' as const, options: ['---'] },
    'Service Entrance': { type: 'select' as const, options: ['---'] },
    'Meter Enclosure Type': { type: 'select' as const, options: ['Meter/Main Combo'] },
    'System Voltage': { type: 'select' as const, options: ['---'] },
    'Service Rating': { type: 'select' as const, options: ['---'] },
  };

  const siteInfoConfig = {
    'PV Conduit Run': { type: 'select' as const, options: ['Exterior'] },
    'Number of Stories': { type: 'select' as const, options: ['2'] },
    'Points of Interconnection': { type: 'select' as const, options: ['2'] },
    'Drywall Cut Needed': { type: 'select' as const, options: ['Yes', 'No'] },
    'Trenching Required': { type: 'select' as const, options: ['Yes', 'No'] },
  };

  const pvInterconnectionConfig = {
    'Type': { type: 'select' as const, options: ['Lug Connection'] },
    'Location': { type: 'select' as const, options: ['Meter'] },
    'Supply/load Side': { type: 'select' as const, options: ['Supply Side'] },
  };

  const essInterconnectionConfig = {
    'Backup Type': { type: 'select' as const, options: ['Full Home'] },
    'Fed By': { type: 'select' as const, options: ['Breaker'] },
    'Transfer Switch': { type: 'select' as const, options: ['Tesla Backup Gateway 2'] },
  };

  const [electricalEquipment, setElectricalEquipment] = useState<Fields>({
    'New Or Existing': 'New',
    'Busbar Rating': '200',
    'Available Backfeed': '40',
    'Panel Brand': 'Lelon',
    'Main Breaker Rating': '200',
    'Required Backfeed': ''
  });

  const [electricalSystem, setElectricalSystem] = useState<Fields>({
    'System Phase': '',
    'Service Entrance': '',
    'Meter Enclosure Type': 'Meter/Main Combo',
    'System Voltage': '',
    'Service Rating': ''
  });

  const [siteInfo, setSiteInfo] = useState<Fields>({
    'PV Conduit Run': 'Exterior',
    'Number of Stories': '2',
    'Points of Interconnection': '2',
    'Drywall Cut Needed': 'Yes',
    'Trenching Required': 'Yes'
  });

  const [roofCoverage, setRoofCoverage] = useState<Fields>({
    'Total Roof Area': '',
    'Area of EXIST Modules': '',
    'Area of New Modules': '',
    'Coverage Percentage': '50%'
  });

  const [pvInterconnection, setPvInterconnection] = useState<Fields>({
    'Type': 'Lug Connection',
    'Location': 'Meter',
    'Supply/load Side': 'Supply Side',
    'Sub - Location Tap Details': ''
  });

  const [essInterconnection, setEssInterconnection] = useState<Fields>({
    'Backup Type': 'Full Home',
    'Fed By': 'Breaker',
    'Transfer Switch': 'Tesla Backup Gateway 2'
  });

  const [stringInverter, setStringInverter] = useState<Fields>({
    'Inverter': 'Tesla Inverter 7.6kW',
    'Max': '',
    ...Object.fromEntries([...Array(8)].map((_, i) => [
      `MPPT${i + 1}`,
      { 'S.1': '', 'S.2': '' }
    ]))
  });

  const [servicePanelInfo, setServicePanelInfo] = useState<Fields>({
    'Panel Brand': 'Lelon',
    'Main Breaker Rating': '200',
    'Available Backfeed': '40',
    'Busbar Rating': '200',
    'Required Backfeed': ''
  });

  const [measurementConversion, setMeasurementConversion] = useState<Fields>({
    'Length': '',
    'Height': '',
    'Width': '',
    'Other': ''
  });

  const [existingPvSystem, setExistingPvSystem] = useState<Fields>({
    'Module Quantity': '40',
    'Wattage': '320 W DC',
    'Model#': 'Longi LR6-60HPH-32M',
    'Module Area': '18.04 sqft',
    'Inverter 1 Quantity': '1',
    'Inverter 1 Output(A)': '21A AC',
    'Inverter 1 Model#': 'Solar Edge SE5000H-US',
    'Inverter 2 Quantity': '1',
    'Inverter 2 Output(A)': '21A AC',
    'Inverter 2 Model#': 'Solar Edge SE5000H-US',
    'Existing Calculated Backfeed(w/o 125%)': ''
  });

  const renderStringInverterGrid = (
    isEditing: boolean,
    editedFields: Fields,
    handleFieldChange: (key: string, value: string | MPPTValue) => void,
    handleEdit: () => void,
    handleCancel: () => void
  ) => (
    <div style={styles.cardStyle}>
      <div style={styles.sectionHeaderStyle}>
        <h2 style={styles.titleStyle}>String Inverter Configuration</h2>
        {isEditing ? (
          <div style={styles.actionButtonsStyle}>
            <button style={styles.cancelButtonStyle} onClick={handleCancel}>
              <AiOutlineClose size={15} />
            </button>
            <button style={styles.saveButtonStyle} onClick={handleEdit}>
              <AiOutlineCheck size={15} />
            </button>
          </div>
        ) : (
          <button style={styles.editButtonStyle}>
            <AiOutlineEdit size={15} />
          </button>
        )}
      </div>
      <div style={styles.gridStyle}>
        <div style={styles.fieldGroupStyle}>
          <div style={styles.labelStyle}>Inverter</div>
          {isEditing ? (
            <select
              style={styles.selectStyle}
              value={editedFields['Inverter'] as string}
              onChange={(e) => handleFieldChange('Inverter', e.target.value)}
            >
              <option value="Tesla Inverter 7.6kW">Tesla Inverter 7.6kW</option>
            </select>
          ) : (
            <div style={styles.valueStyle}>{String(editedFields['Inverter'])}</div>
          )}
        </div>
        <div style={styles.fieldGroupStyle}>
          <div style={styles.labelStyle}>Max</div>
          {isEditing ? (
            <input
              style={styles.inputStyle}
              value={editedFields['Max'] as string}
              onChange={(e) => handleFieldChange('Max', e.target.value)}
            />
          ) : (
            <div style={styles.valueStyle}>{String(editedFields['Max']) || '---'}</div>
          )}
        </div>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginTop: '20px'
      }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={styles.fieldGroupStyle}>
            <div style={styles.labelStyle}>{`MPPT${i + 1}`}</div>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  style={{ ...styles.inputStyle, flex: 1 }}
                  value={(editedFields[`MPPT${i + 1}`] as MPPTValue)['S.1']}
                  onChange={(e) => handleFieldChange(`MPPT${i + 1}`, {
                    ...(editedFields[`MPPT${i + 1}`] as MPPTValue),
                    'S.1': e.target.value
                  })}
                  placeholder="S.1"
                />
                <input
                  style={{ ...styles.inputStyle, flex: 1 }}
                  value={(editedFields[`MPPT${i + 1}`] as MPPTValue)['S.2']}
                  onChange={(e) => handleFieldChange(`MPPT${i + 1}`, {
                    ...(editedFields[`MPPT${i + 1}`] as MPPTValue),
                    'S.2': e.target.value
                  })}
                  placeholder="S.2"
                />
              </div>
            ) : (
              <div style={styles.valueStyle}>
                <div>S.1 {(editedFields[`MPPT${i + 1}`] as MPPTValue)['S.1'] || '---'}</div>
                <div>S.2 {(editedFields[`MPPT${i + 1}`] as MPPTValue)['S.2'] || '---'}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '24px',
      height: '100vh',
      overflowY: 'scroll',
      padding: '24px',
    }}>
      <div style={{ flex: 1, maxWidth: '50%' }}>
        <Card
          title="Electrical Equipment Info"
          fields={electricalEquipment}
          onSave={setElectricalEquipment}
          fieldConfigs={electricalEquipmentConfig}
        />
        <Card
          title="Electrical System Info"
          fields={electricalSystem}
          onSave={setElectricalSystem}
          fieldConfigs={electricalSystemConfig}
        />
        <Card
          title="Site Info"
          fields={siteInfo}
          onSave={setSiteInfo}
          fieldConfigs={siteInfoConfig}
        />
        <Card
          title="Roof Coverage Calculator"
          fields={roofCoverage}
          onSave={setRoofCoverage}
        />
        <Card
          title="PV only Interconnection"
          fields={pvInterconnection}
          onSave={setPvInterconnection}
          fieldConfigs={pvInterconnectionConfig}
        />
        <Card
          title="ESS Interconnection"
          fields={essInterconnection}
          onSave={setEssInterconnection}
          fieldConfigs={essInterconnectionConfig}
        />
      </div>

      <div style={{ flex: 1, maxWidth: '50%' }}>
        <Card
          title="String Inverter Configuration"
          fields={stringInverter}
          onSave={setStringInverter}
          customGrid={renderStringInverterGrid}
        />
        <Card
          title="Service Panel Info"
          fields={servicePanelInfo}
          onSave={setServicePanelInfo}
        />
        <Card
          title="Measurement Conversion"
          fields={measurementConversion}
          onSave={setMeasurementConversion}
        />
        <Card
          title="Existing PV System Info"
          fields={existingPvSystem}
          onSave={setExistingPvSystem}
        />
      </div>
    </div>
  );
}

export default OtherPage;