import { FormFeedback, Label } from "reactstrap";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider"; // Assuming you define BaseSliderProps
import { BaseSliderProps } from "interfaces/global.interface";

const BaseSlider = ({
  label,
  name,
  className,
  value,
  handleChange,
  min,
  max,
  step,
  disabled,
  error,
  touched,
  valueLabelDisplay,
  valueLabelFormat,
}: BaseSliderProps) => {
  const valuetext = (value: number) => `${value}°C`;

  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
      )}
      <Box sx={{ width: 300 }} className={className}>
        <Slider
          value={value || [20, 37]}
          onChange={handleChange}
          valueLabelDisplay={valueLabelDisplay || "auto"}
          getAriaLabel={() => "Temperature range"}
          getAriaValueText={valuetext}
          min={min || 0}
          max={max || 100}
          step={step || 1}
          disabled={disabled}
          valueLabelFormat={valueLabelFormat}
        />
      </Box>
      {touched && error ? (
        <FormFeedback type="invalid">{error}</FormFeedback>
      ) : null}
    </>
  );
};

export default BaseSlider;
