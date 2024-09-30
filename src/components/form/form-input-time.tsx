import "./form.css";

interface FormInputTimeProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inline?: boolean;
  required?: boolean;
}
export default function FormInputTime (
  { label, id, value, onChange, inline, required }: FormInputTimeProps
) {
  return (
      <div className={`form-element ${inline ? 'inline' : ''}`}>
        <label htmlFor={id}>{label}</label>
        <input
          type="time"
          id={id}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
  );
}