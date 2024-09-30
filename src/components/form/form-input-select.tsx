import { EventType } from "../../types";

import "./form.css"

interface FormInputSelectProps {
    label: string;
    id: string;
    value: EventType;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    inline?: boolean;
    required?: boolean;
    children: React.ReactNode;
}

export default function FormInputSelect (
  { id, label, value, onChange, inline, required, children }: FormInputSelectProps
) {
    return (
        <div className={`form-element ${inline ? 'inline' : ''}`}>
          <label htmlFor={id}>{label}</label>
          <select
              id={id}
              value={value}
              onChange={onChange}
              required={required}
          >
              {children}
          </select>
      </div>
    )
}
