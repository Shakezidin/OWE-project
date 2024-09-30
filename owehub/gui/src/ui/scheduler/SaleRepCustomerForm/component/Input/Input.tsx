import React, { memo, useEffect, useRef } from 'react';
import styles from './styles/index.module.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { FaCheck } from 'react-icons/fa6';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showIsEditing?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  showIsEditing = true,
  ...rest
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { className } = rest;

  useEffect(() => {
    if (isEditing && showIsEditing) {
      inputRef.current?.focus();
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    };
    if (showIsEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, showIsEditing]);

  return (
    <div>
      {label && (
        <label className={styles.input_label} htmlFor={id}>
          {label}
        </label>
      )}
      <div ref={wrapperRef} className={styles.input_wrapper}>
        <input
          ref={inputRef}
          id={id}
          {...rest}
          readOnly={showIsEditing ? !isEditing : undefined}
          className={`${styles.input_field} ${className}`}
        />
        {showIsEditing && (
          <span
            className={styles.edit_btn}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? (
              <FaCheck size={21} color="#377CF6" />
            ) : (
              <AiOutlineEdit size={15} color="#C1C1C1" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(Input);
