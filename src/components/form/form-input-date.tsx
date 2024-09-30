import "./form.css";

interface FormInputDateProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  inline?: boolean;
  required?: boolean;
}
export default function FormInputDate (
  { label, id, value, onChange, min, inline, required }: FormInputDateProps
) {
  return (
      <div className={`form-element ${inline ? 'inline' : ''}`}>
        <label htmlFor={id}>{label}</label>
        <input
            type="date"
            id={id}
            value={value}
            onChange={onChange}
            min={min}
            required={required}
        />
      </div>
  );
}