import React from 'react';
import { AiOutlineEdit } from 'react-icons/ai';

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '28px',
  padding: '24px',
  marginBottom: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  width: '100%',
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const titleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#333',
  margin: 0,
};

const editButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#FF6B6B',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const fieldGroupStyle = {
  marginBottom: '16px',
};

const labelStyle = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '4px',
};

const valueStyle = {
  fontSize: '14px',
  color: '#333',
  display:'flex',
  gap: '50px',
};

function OtherPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '24px',
        height: '100vh',
        overflowY: 'scroll',
      }}
    >
      <div style={{ flex: 1, maxWidth: '50%' }}>
        {/* Electrical Equipment Info */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={titleStyle}>Electrical Equipment Info</h2>
            <AiOutlineEdit/>
          </div>
          <div style={gridStyle}>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>New Or Existing</div>
                <div style={valueStyle}>New</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Busbar Rating</div>
                <div style={valueStyle}>200</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Available Backfeed</div>
                <div style={valueStyle}>40</div>
              </div>
            </div>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Panel Brand</div>
                <div style={valueStyle}>Lelon</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Main Breaker Rating</div>
                <div style={valueStyle}>200</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Required Backfeed</div>
                <div style={valueStyle}>---</div>
              </div>
            </div>
          </div>
        </div>

        {/* Electrical System Info */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={titleStyle}>Electrical System Info</h2>
            <AiOutlineEdit/>
          </div>
          <div style={gridStyle}>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>System Phase</div>
                <div style={valueStyle}>---</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Service Entrance</div>
                <div style={valueStyle}>---</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Meter Enclosure Type</div>
                <div style={valueStyle}>Meter/Main Combo</div>
              </div>
            </div>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>System Voltage</div>
                <div style={valueStyle}>---</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Service Rating</div>
                <div style={valueStyle}>---</div>
              </div>
            </div>
          </div>
        </div>

        {/* Site Info */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={titleStyle}>Site Info</h2>
            <AiOutlineEdit/>
          </div>
          <div style={gridStyle}>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>PV Conduit Run</div>
                <div style={valueStyle}>Exterior</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Number of Stories</div>
                <div style={valueStyle}>2</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Points of Interconnection</div>
                <div style={valueStyle}>2</div>
              </div>
            </div>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Drywall Cut Needed</div>
                <div style={valueStyle}>Yes</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Trenching Required</div>
                <div style={valueStyle}>Yes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Roof Coverage Calculator */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={titleStyle}>Roof Coverage Calculator</h2>
            <AiOutlineEdit/>
          </div>
          <div style={gridStyle}>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Total Roof Area</div>
                <div style={valueStyle}>---</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Area of EXIST Modules</div>
                <div style={valueStyle}>---</div>
              </div>
            </div>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Area of New Modules</div>
                <div style={valueStyle}>---</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Coverage Percentage</div>
                <div style={valueStyle}>50%</div>
              </div>
            </div>
          </div>
        </div>

        {/* PV only Interconnection */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={titleStyle}>PV only Interconnection</h2>
            <AiOutlineEdit/>
          </div>
          <div style={gridStyle}>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Type</div>
                <div style={valueStyle}>Lug Connection</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Location</div>
                <div style={valueStyle}>Meter</div>
              </div>
            </div>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Supply/load Side</div>
                <div style={valueStyle}>Supply Side</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Sub - Location Tap Details</div>
                <div style={valueStyle}>---</div>
              </div>
            </div>
          </div>
        </div>

        {/* ESS Interconnection */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={titleStyle}>ESS Interconnection</h2>
            <AiOutlineEdit/>
          </div>
          <div style={gridStyle}>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Backup Type</div>
                <div style={valueStyle}>Full Home</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Fed By</div>
                <div style={valueStyle}>Breaker</div>
              </div>
            </div>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Transfer Switch</div>
                <div style={valueStyle}>Tesla Backup Gateway 2</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '50%' }}>
          {/* String Inverter Configuration */}
          <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={titleStyle}>String Inverter Configuration</h2>
            <AiOutlineEdit/>
          </div>
          <div style={gridStyle}>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Inverter</div>
              <div style={valueStyle}>Tesla Inverter 7.6kW</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Max</div>
              <div style={valueStyle}>---</div>
            </div>
          </div>
          {/* MPPT Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginTop: '20px'
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={fieldGroupStyle}>
                <div style={labelStyle}>{`MPPT${i + 1}`}</div>
                <div style={valueStyle}>
                  <div>S.1 ---</div>
                  <div>S.2 ---</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Service Panel Info */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={titleStyle}>Roof Coverage Calculator</h2>
            <AiOutlineEdit/>
          </div>
          <div style={gridStyle}>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Panel Brand</div>
                <div style={valueStyle}>Lelon</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Main Breaker Rating</div>
                <div style={valueStyle}>200</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Available Backfeed</div>
                <div style={valueStyle}>40</div>
              </div>
            </div>
            <div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Busbar Rating</div>
                <div style={valueStyle}>200</div>
              </div>
              <div style={fieldGroupStyle}>
                <div style={labelStyle}>Required Backfeed</div>
                <div style={valueStyle}>---</div>
              </div>
            </div>
          </div>
        </div>


        <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={titleStyle}>Roof Coverage Calculator</h2>
          <AiOutlineEdit/>
        </div>
        <div style={gridStyle}>
          <div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Total Roof Area</div>
              <div style={valueStyle}>---</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Area of EXIST Modules</div>
              <div style={valueStyle}>---</div>
            </div>
          </div>
          <div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Area of New Modules</div>
              <div style={valueStyle}>---</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Coverage Percentage</div>
              <div style={valueStyle}>50%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Measurement Conversion */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={titleStyle}>Measurement Conversion</h2>
          <AiOutlineEdit/>
        </div>
        <div style={gridStyle}>
          <div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Length</div>
              <div style={valueStyle}>---</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Height</div>
              <div style={valueStyle}>---</div>
            </div>
          </div>
          <div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Width</div>
              <div style={valueStyle}>---</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Other</div>
              <div style={valueStyle}>---</div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing PV System Info */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={titleStyle}>Existing PV System Info</h2>
          <AiOutlineEdit/>
        </div>
        <div style={gridStyle}>
          <div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Module Quantity</div>
              <div style={valueStyle}>40</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Wattage</div>
              <div style={valueStyle}>320 W DC</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Inverter 1</div>
              <div>
                <div style={fieldGroupStyle}>
                  <div style={labelStyle}>Quantity</div>
                  <div style={valueStyle}>1</div>
                </div>
                <div style={fieldGroupStyle}>
                  <div style={labelStyle}>Output(A)</div>
                  <div style={valueStyle}>21A AC</div>
                </div>
              </div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Inverter 2</div>
              <div>
                <div style={fieldGroupStyle}>
                  <div style={labelStyle}>Quantity</div>
                  <div style={valueStyle}>1</div>
                </div>
                <div style={fieldGroupStyle}>
                  <div style={labelStyle}>Output(A)</div>
                  <div style={valueStyle}>21A AC</div>
                </div>
              </div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Existing Calculated Backfeed(w/o 125%)</div>
              <div style={valueStyle}>Backfeed ---</div>
            </div>
          </div>
          <div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Model#</div>
              <div style={valueStyle}>Longi LR6-60HPH-32M</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Module Area</div>
              <div style={valueStyle}>18.04 sqft</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Model#</div>
              <div style={valueStyle}>Solar Edge SE5000H-US</div>
            </div>
            <div style={fieldGroupStyle}>
              <div style={labelStyle}>Model#</div>
              <div style={valueStyle}>Solar Edge SE5000H-US</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default OtherPage;
