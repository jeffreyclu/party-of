import React from "react";

interface FormInputCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string | React.ReactNode;
}

export default function FormInputCheckbox ({ checked, onChange, label }: FormInputCheckboxProps) {
  return (
    <div className="form-element">
        <label>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            {label}
        </label>
    </div>
  )
}