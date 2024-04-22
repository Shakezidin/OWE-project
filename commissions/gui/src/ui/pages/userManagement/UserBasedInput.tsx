import React from "react";
import Input from "../../components/text_input/Input";

interface inputSelectProps {
  onChange: any;
  createUserOnboarding: any;
}

const UserBasedInput: React.FC<inputSelectProps> = ({
  createUserOnboarding,
  onChange,
}) => {
  return (
    <div className="create-input-container">
      {createUserOnboarding?.role_name === "rm" && (
        <div className="create-input-field">
          <Input
            type={"text"}
            label="Add Region"
            value={createUserOnboarding.add_region}
            placeholder={"Add Region"}
            onChange={(e) => onChange(e)}
            name={"add_region"}
          />
        </div>
      )}
      {createUserOnboarding?.role_name === "sales_rep_m" && (
        <>
          <div className="create-input-field">
            <Input
              type={"text"}
              label="Report To"
              value={createUserOnboarding.report_to}
              placeholder={"Report To"}
              onChange={(e) => onChange(e)}
              name={"report_to"}
            />
          </div>
          <div className="create-input-field">
            <Input
              type={"text"}
              label="Team Name"
              value={createUserOnboarding.team_name}
              placeholder={"Team Name"}
              onChange={(e) => onChange(e)}
              name={"team_name"}
            />
          </div>
        </>
      )}
      {createUserOnboarding?.role_name === "sales_m" && (
        <>
          <div className="create-input-field">
            <Input
              type={"text"}
              label="Add Region"
              value={createUserOnboarding.add_region}
              placeholder={"Add Region"}
              onChange={(e) => onChange(e)}
              name={"add_region"}
            />
          </div>
          <div className="create-input-field">
            <Input
              type={"text"}
              label="Reporting To"
              value={createUserOnboarding.reporting_to}
              placeholder={"Reporting To"}
              onChange={(e) => onChange(e)}
              name={"reporting_to"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserBasedInput;
