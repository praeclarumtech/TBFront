import React from 'react';
import { Row, Col } from "react-bootstrap";
import BaseInput from "components/BaseComponents/BaseInput";
import { InputPlaceHolder } from "utils/commonFunctions";

interface DateRangeInputsProps {
  startDate: string;
  endDate: string;
  updatedStartDate: string;
  updatedEndDate: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>, isStartDate: boolean) => void;
  onUpdateDateChange: (e: React.ChangeEvent<HTMLInputElement>, isStartDate: boolean) => void;
  today: string;
}

const DateRangeInputs: React.FC<DateRangeInputsProps> = ({
  startDate,
  endDate,
  updatedStartDate,
  updatedEndDate,
  onDateChange,
  onUpdateDateChange,
  today,
}) => {
  return (
    <>
      <Row className="mb-3">
        <Col xs={6}>
          <BaseInput
            label="Created Start Date"
            name="startDate"
            className="mb-1 select-border"
            type="date"
            placeholder={InputPlaceHolder("Start Date")}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onDateChange(e, true)
            }
            value={startDate || ""}
            max={today}
          />
        </Col>
        <Col xs={6}>
          <BaseInput
            label="Created End Date"
            name="endDate"
            type="date"
            placeholder={InputPlaceHolder("End Date")}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onDateChange(e, false)
            }
            value={endDate || ""}
            max={today}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6}>
          <BaseInput
            label="Update Start Date"
            name="updatedStartDate"
            className="mb-1 select-border"
            type="date"
            placeholder={InputPlaceHolder("Start Date")}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onUpdateDateChange(e, true)
            }
            value={updatedStartDate || ""}
            max={today}
          />
        </Col>
        <Col xs={6}>
          <BaseInput
            label="Update End Date"
            name="updatedEndDate"
            type="date"
            placeholder={InputPlaceHolder("End Date")}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onUpdateDateChange(e, false)
            }
            value={updatedEndDate || ""}
            max={today}
          />
        </Col>
      </Row>
    </>
  );
};

export default DateRangeInputs;
