import { ChangeEvent, FC } from "react";
import "./Input.css";
import { ReactComponent as EYE_ICON } from "../../../resources/assets/eye-icon.svg";

interface InputProps {
  type: "text" | "number" | "email" | "password" | "date";
  value: string | number;
  placeholder: string;
  label?: string;
  name: string;
  error?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickEyeIcon?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  type,
  value,
  placeholder,
  error,
  disabled,
  name,
  label,
  onChange,
}) => {
  return (
    <div className="input-wrapper">
      {label && <label className="inputLabel">{label}</label>}
      <div className="input-inner-view">
      <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
        {type === "password" ? <EYE_ICON className="eyeIcon" style={{marginRight:".5rem"}}/> : <></>}
      </div>
      {error && <p className="error">Input filed can't be empty!</p>}
    </div>
  );
};

export default Input;
