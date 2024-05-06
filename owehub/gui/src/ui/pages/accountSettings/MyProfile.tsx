import React, { useState, useEffect } from "react";
import Input from "../../components/text_input/Input";
import { ICONS } from "../../icons/Icons";
import Select from "react-select";
import { ActionButton } from "../../components/button/ActionButton";
import SelectOption from "../../components/selectOption/SelectOption";
const MyProfile = () => {
  const [stateOptions, setStateOptions] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    fetchStateOptions()
      .then((options) => {
        setStateOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching state options:", error);
      });
  }, []);

  const fetchStateOptions = async () => {
 
    const response = await fetch("https://api.example.com/states");
    const data = await response.json();
    return data.map((state: string) => ({ value: state, label: state }));
  };

  const handleStateChange = (selectedOption: any) => {
    setSelectedState(selectedOption.value);
  };

  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const [errors, setErrors] = useState({
    street: "",
    zipCode: "",
    country: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      street: street ? "" : "Street is required",
      zipCode: country ? "" : "Zip Code is required",
      country: country ? "" : "Country is required",
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      console.log("Form submitted successfully");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="myProf-section">
          <div className="">
            <p>My Profile</p>
          </div>
          <div className="admin-section">
            <div className="">
              <img src={ICONS.userPic} alt="" />
            </div>

            <div className="caleb-container">
              <div className="caleb-section">
                <h3>Shushank </h3>
                <p>Admin</p>
              </div>
              {/* <div className='edit-section'>
                            <img src={ICONS.editIcon} alt="" />
                            <p>Edit</p>
                        </div> */}
            </div>
          </div>

          <div className="Personal-container">
            <div className="personal-section">
              <div className="">
                <p>Personal Information</p>
              </div>
              <div className="edit-section">
                <img src={ICONS.editIcon} alt="" />
                <p>Edit</p>
              </div>
            </div>


            <div
              className="create-input-container"
              style={{ padding: "0.5rem", marginLeft: "1rem", gap: "24px"}}
            >
              <div className="create-input-field-profile">
                <Input
                  type={"text"}
                  label="First Name"
                  value={""}
                  name="fee_rate"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                  disabled
                />
              </div>
              <div className="create-input-field-profile">
                <Input
                  type={"text"}
                  label="Last Name"
                  value={""}
                  name="fee_rate"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                  disabled
                />
              </div>
            </div>
            <div
              className="create-input-container"
              style={{ padding: "0.5rem", marginLeft: "1rem", gap: "24px" }}
            >
              <div className="create-input-field-profile">
                <Input
                  type={"text"}
                  label="Email"
                  value={""}
                  name="fee_rate"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                  disabled
                />
              </div>
              <div className="create-input-field-profile">
                <Input
                  type={"text"}
                  label="Phone Number"
                  value={""}
                  name="fee_rate"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="Personal-container-detail">
            <div className="personal-section">
              <div className="">
                <p>Address Detail</p>
              </div>
              <div className="edit-section">
                <img src={ICONS.editIcon} alt="" />
                <p>Edit</p>
              </div>
            </div>
            <div
              className="create-input-container"
              style={{ padding: "0.5rem", marginLeft: "1rem", gap: "24px" }}
            >
              <div className="create-input-field-address">
                <Input
                  type={"text"}
                  label="Street"
                  value={street}
                  name=""
                  placeholder={"Enter"}
                  onChange={(e) => {setStreet(e.target.value);
                    setErrors({ ...errors, street: "" });
                  }}
                />
                {errors.street && (
                  <span className="error">{errors.street}</span>
                )}
              </div>
              <div className="create-input-field-address">
                <label className="inputLabel-select">State</label>
                <SelectOption
                  onChange={handleStateChange}
                  options={stateOptions}
                  value={stateOptions?.find((option) => option.value === " ")}
                />
              </div>
              <div className="create-input-field-address">
                <label className="inputLabel-select">City</label>
                <SelectOption
                  onChange={handleStateChange}
                  options={stateOptions}
                  value={stateOptions?.find((option) => option.value === " ")}
                />
                  
              </div>
            </div>
            <div
              className="create-input-container"
              style={{ padding: "0.5rem", marginLeft: "1rem", gap: "24px"  }}
            >
              <div className="create-input-field-address">
                <Input
                  type={"text"}
                  label="Zip Code"
                  value={zipCode}
                  name=""
                  placeholder={"Enter"}
                  onChange={(e) => {setZipCode(e.target.value);
                    setErrors({ ...errors, zipCode: "" });

                  }}
                />
                {errors.zipCode && (
                  <span className="error">{errors.zipCode}</span>
                )}
              </div>
              <div className="create-input-field-address">
                <Input
                  type={"text"}
                  label="Country"
                  value={country}
                  name=""
                  placeholder={"Enter"}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setErrors({ ...errors, country: "" });
                  }}
                />
                {errors.country && (
                  <span className="error">{errors.country}</span>
                )}
              </div>
            </div>
          </div>
          <div className="">
            <div className="profile-reset">
              <ActionButton title={"Reset"} type="reset" onClick={() => {}} />
              <ActionButton title={"Update"} type="submit" onClick={() => {}} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default MyProfile;
