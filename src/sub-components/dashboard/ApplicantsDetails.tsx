// import { useState } from "react";
import CheckboxMultiSelect from "components/BaseComponents/CheckboxMultiSelect";
import BarChart from "./chart/BarChart";
import { Card, Col, Row } from "react-bootstrap";
import {
  SelectedOption,
  SelectedOption1,
} from "interfaces/applicant.interface";
import { useEffect, useState } from "react";
import { getChartDetails, ViewAppliedSkillsDashboard } from "api/dashboardApi";
import { toast } from "react-toastify";

const ApplicantsDetails = ({
  setSelectedTechnology,
  ids,
}: {
  setSelectedTechnology: (tech: string | null) => void;
  ids: any;
}) => {
  const [appliedSkills, setAppliedSkills] = useState<SelectedOption[]>([]);
  const [skillOptions, setSkillOptions] = useState<SelectedOption1[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(true);

  const [chartData, setChartData] = useState<any>([]);

  const fetchSkills = async () => {
    try {
      const response = await ViewAppliedSkillsDashboard({
        page: 1,
        pageSize: 500,
        limit: 500,
      });

      const skillData = response?.data?.data || [];
      setSkillOptions(
        skillData.map((item: any) => ({
          label: item.skills,
          value: item._id,
        }))
      );
    } catch (error: any) {
      const details = error?.response?.data?.details;
      if (Array.isArray(details)) {
        details.forEach((msg: string) => {
          toast.error(msg, {
            closeOnClick: true,
            autoClose: 5000,
          });
        });
      } else {
        toast.error("Failed to fetch skills.. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
      }
    }
  };

  const fetchChart = async () => {
    // If nothing to show, just skip
    if (!ids && appliedSkills.length === 0) return;

    setChartLoading(true);

    try {
      const dataToSend =
        appliedSkills.length > 0 ? appliedSkills.map((opt) => opt.value) : ids;

      const response = await getChartDetails(dataToSend);

      setChartData(response?.data);
    } catch (error: any) {
      const details = error?.response?.data?.details;
      if (Array.isArray(details)) {
        details.forEach((msg: string) => {
          toast.error(msg, {
            closeOnClick: true,
            autoClose: 5000,
          });
        });
      }
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    fetchChart();
  }, [appliedSkills, ids]);

  const handleChnage = (
    selectedOptions: any[] | ((prevState: SelectedOption[]) => SelectedOption[])
  ) => {
    setAppliedSkills(selectedOptions);

    if (Array.isArray(selectedOptions)) {
      console.log(
        "Selected values:",
        selectedOptions.map((opt: { value: any }) => opt.value)
      );

      setAppliedSkills(selectedOptions);
    }
  };
  return (
    <Row className="mt-6">
      <Col>
        <Card className=" w-full min-h-[400px]">
          <Card.Header className="gap-2 p-4 bg-white border-0 d-flex justify-content-between align-items-center">
            <h4 className="h4">Skills Statistics</h4>
            <div className="w-full sm:w-[250px] md:w-[350px]">
              <CheckboxMultiSelect
                name="selectedColumns"
                className="mb-2 select-border"
                placeholder="Skills..."
                value={appliedSkills}
                isMulti={true}
                showSelectAll={false}
                onChange={handleChnage}
                options={skillOptions}
              />
            </div>
          </Card.Header>
          <Card.Body className="pt-0">
            <BarChart
              onBarClick={setSelectedTechnology}
              selectedFilter={chartData}
              isloading={chartLoading}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default ApplicantsDetails;
