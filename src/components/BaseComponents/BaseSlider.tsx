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

  const currentValue = value || [min, max];

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), currentValue[1]);
    handleChange({ target: { name, value: [newMin, currentValue[1]] } });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newMax = Math.max(Number(e.target.value), currentValue[0]);
    const newMax = Math.max(Number(e.target.value));
    handleChange({ target: { name, value: [currentValue[0], newMax] } });
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    handleChange({ target: { name, value: newValue } });
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

      <div className="d-flex justify-content-between mb-2">
        <input
          type="number"
          value={currentValue[0]}
          onChange={handleMinChange}
          className="form-control form-control-sm no-spinner"
          style={{ width: "40px", height: "30px" }}
        />
        <Box sx={{ width: 300 }} className={className}>
          <Slider
            value={currentValue}
            onChange={handleSliderChange}
            valueLabelDisplay={valueLabelDisplay || "auto"}
            getAriaLabel={() => "Temperature range"}
            getAriaValueText={valuetext}
            min={min || 0}
            max={max || 100}
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
          style={{ width: "40px", height: "30px" }}
        />
      </div>

      {touched && error ? (
        <FormFeedback type="invalid">{error}</FormFeedback>
      ) : null}
    </>
  );
};

export default BaseSlider;
