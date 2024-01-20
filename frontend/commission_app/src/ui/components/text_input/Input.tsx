import { ChangeEvent, FC } from "react";
import "./Input.css";

interface InputProps {
  type: "text" | "number" | "email" | "password";
  value: string | number;
  placeholder: string;
  error?: boolean;
  disabled?: boolean;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
      <input
        type={type}
        id={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <p className="error">Input filed can't be empty!</p>}
    </div>
  );
};

export default Input;
