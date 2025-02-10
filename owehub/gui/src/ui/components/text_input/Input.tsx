import { FC, InputHTMLAttributes } from 'react';
import './Input.css';
import { ReactComponent as EYE_ICON } from '../../../resources/assets/eye-icon.svg';
import { ReactComponent as EYE_OFF_ICON } from '../../../resources/assets/eye-off-icon.svg';
import { ICONS } from '../../../resources/icons/Icons';
import { FormInput } from '../../../core/models/data_models/typesModel';
import { useRef, useEffect, useState } from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type:
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'date'
  | 'datetime-local'
  | 'file'
  | 'category'
  | 'title'
  | 'subTitle'
  | 'dashboard_id';
  value: string | number;
  placeholder: string;
  label?: string;
  name: string;
  error?: boolean;
  disabled?: boolean;
  onChange: (e: FormInput) => void;
  onClickEyeIcon?: () => void;
  isTypePassword?: boolean;
  isTypeSearch?: boolean;
  customRegex?: string;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  isMobile?: boolean;
  backgroundColor?: string;
  labelClassName?: string;
  innerViewClassName?: string;
  noVal?: boolean
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
  onClickEyeIcon,
  isTypePassword,
  isTypeSearch,
  customRegex,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  isMobile,
  backgroundColor,
  labelClassName,
  innerViewClassName = '',
  noVal,
  ...rest
}) => {
  const validationRules = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customRegex) {
      const pattern = new RegExp(customRegex, 'g');
      e.target.value = e.target.value.replace(pattern, '');
    } else {
      if (
        type === 'text' &&
        !name.includes('email') &&
        !name.includes('category') &&
        !name.includes('title') &&
        !name.includes('subTitle') &&
        !name.includes('dashboard_id')
      ) {
        e.target.value = e.target.value.replace(
          /[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF_\- $,.'-]| {2,}/g,
          ''
        );
      }
    }
    if (e.target.value.length < 100) {
      onChange(e);
    }
  };
  //input handle
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const handleClickInside = () => {
    setIsFocused(true); // Set focused state
    inputRef.current?.focus(); // Focus the input
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsFocused(false); // Remove focused state
      inputRef.current.blur(); // Remove focus if clicking outside
    }
  };
  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <div className="input-wrapper">
      {label && (
        <label className={`inputLabel ${labelClassName}`}>{label}</label>
      )}{' '}
      <div
        className={`input-inner-view ${isFocused ? 'focused' : ''} ${innerViewClassName || ''}`}
        onClick={handleClickInside}
      >
        <input
          type={type}
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          autoComplete="off"
          value={value}
          max={'2050-01-01'}
          onChange={(e) => {
            if (name.includes('password')) {
              onChange(e);
              return;
            }
            if (name.includes('unique')) {
              const trim = e.target.value.trim();
              e.target.value = trim;
            }
            if (noVal) {
              const trimmedValue = e.target.value.trimStart();
              const sanitizedValue = trimmedValue.replace(/\s+/g, ' ');
              e.target.value = sanitizedValue;
              onChange(e);
              return;
            }
            return typeof onChange !== 'undefined' &&
              !e.target.value.startsWith(' ')
              ? validationRules(e)
              : undefined;
          }}
          className="input"
          disabled={disabled}
          style={{ backgroundColor }}
          {...rest}
        />
        {isTypePassword && type === 'text' ? (
          <EYE_ICON
            className="eyeIcon"
            style={{ marginRight: '0.5rem' }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          />
        ) : null}
        {isTypePassword && type === 'password' ? (
          <EYE_OFF_ICON
            className="eyeIcon"
            style={{ marginRight: '0.5rem' }}
            onClick={() => {
              if (isMobile) {
                onClickEyeIcon?.();
              }
            }}
            onMouseDown={() => {
              if (!isMobile) {
                onMouseDown?.();
              }
            }}
            onMouseUp={() => {
              if (!isMobile) {
                onMouseUp?.();
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                onMouseLeave?.();
              }
            }}
          />
        ) : null}
        {isTypeSearch ? (
          <img
            className="eyeIcon"
            src={ICONS.search}
            style={{ marginRight: '.5rem' }}
            onClick={onClickEyeIcon}
            alt=""
          />
        ) : null}
      </div>
      {error && <p className="error">Input field can't be empty!</p>}
    </div>
  );
};

export default Input;
