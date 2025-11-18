import { FormFeedback, Label } from "reactstrap";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { BaseSliderProps } from "interfaces/global.interface";
import "./styles.css";
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

  const minValue = min || 0;
  const maxValue = max || 100;
  const currentValue =
    Array.isArray(value) && value.length === 2
      ? [
          Math.max(minValue, Math.min(maxValue, value[0])),
          Math.max(minValue, Math.min(maxValue, value[1])),
        ]
      : [minValue, maxValue];

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    const newMin = Math.max(
      minValue,
      Math.min(inputValue, currentValue[1], maxValue)
    );
    const newValue: number[] = [newMin, currentValue[1]];
    handleChange(newValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    const newMax = Math.min(
      maxValue,
      Math.max(inputValue, currentValue[0], minValue)
    );
    const newValue: number[] = [currentValue[0], newMax];
    handleChange(newValue);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const valueArray = Array.isArray(newValue)
      ? newValue
      : [newValue, newValue];
    handleChange(valueArray);
  };

  return (
    <>
      <style>
        {`
    /* Chrome, Safari, Edge */
    .no-spinner::-webkit-outer-spin-button,
    .no-spinner::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    .no-spinner {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  `}
      </style>
      {label && (
        <Label
          htmlFor={name}
          className="form-label  text-gray-700 font-semibold"
        >
          {label}
        </Label>
      )}

      <div
        className="d-flex justify-content-between align-items-center mb-2"
        style={{ gap: "12px" }}
      >
        <input
          type="number"
          value={currentValue[0]}
          onChange={handleMinChange}
          className="form-control form-control-sm no-spinner"
          style={{ width: "40px", height: "30px", marginRight: "8px" }}
        />
        <Box sx={{ width: 300, flex: 1 }} className={className}>
          <Slider
            value={currentValue}
            onChange={handleSliderChange}
            valueLabelDisplay={valueLabelDisplay || "auto"}
            getAriaLabel={() => "Temperature range"}
            getAriaValueText={valuetext}
            min={minValue}
            max={maxValue}
            step={step || 1}
            disabled={disabled}
            valueLabelFormat={valueLabelFormat}
            sx={{
              "& .MuiSlider-thumb": {
                borderRadius: "50%",
                width: "15px",
                height: "15px",
                color: "#212B36",
              },
              "& .MuiSlider-rail": {
                opacity: 0.3,
              },
              "& .MuiSlider-track": {
                borderRadius: "6px",
              },
            }}
          />
        </Box>
        <input
          type="number"
          value={currentValue[1]}
          onChange={handleMaxChange}
          className="form-control form-control-sm no-spinner"
          style={{ width: "40px", height: "30px", marginLeft: "8px" }}
        />
      </div>

      {touched && error ? (
        <FormFeedback type="invalid">{error}</FormFeedback>
      ) : null}
    </>
  );
};

export default BaseSlider;
