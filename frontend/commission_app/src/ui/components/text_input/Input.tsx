import { ChangeEvent, FC } from "react";
import "./Input.css";
import { ReactComponent as EYE_ICON } from "../../../resources/assets/eye-icon.svg";

interface InputProps {
  type: "text" | "number" | "email" | "password";
  value: string | number;
  placeholder: string;
  error?: boolean;
  disabled?: boolean;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickEyeIcon?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  type,
  value,
  placeholder,
  error,
  disabled,
  name,
  onChange,
}) => {
  return (
    <div className="input-wrapper">
      <div className="input-inner-view">
        <input
          type={type}
          id={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
        />
        {type === "password" ? <EYE_ICON className="eyeIcon" /> : <></>}
      </div>

      {error && <p className="error">Input filed can't be empty!</p>}
    </div>
  );
};

export default Input;
