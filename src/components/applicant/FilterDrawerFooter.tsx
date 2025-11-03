import React from 'react';
import { Row, Col } from "react-bootstrap";
import BaseButton from "components/BaseComponents/BaseButton";
import { DRAWER_STYLES } from "../../constants/applicantConstants";

interface FilterDrawerFooterProps {
  onResetFilters: () => void;
}

const FilterDrawerFooter: React.FC<FilterDrawerFooterProps> = ({ onResetFilters }) => {
  return (
    <div style={DRAWER_STYLES.stickyFooter}>
      <Row>
        <Col className="text-end">
          <BaseButton
            color="primary"
            onClick={onResetFilters}
            sx={{ width: "auto" }}
          >
            Reset Filters
          </BaseButton>
        </Col>
      </Row>
    </div>
  );
};

export default FilterDrawerFooter;
