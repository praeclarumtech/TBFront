/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import TableContainer from "components/BaseComponents/TableContainer";
import { Col, Row, Card } from "react-bootstrap";
import {
  ExportSkilledApplicant,
  getRecentApplications,
} from "api/dashboardApi";
import appConstants from "constants/constant";
import { errorHandle, getSerialNumber } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import saveAs from "file-saver";
import BaseButton from "components/BaseComponents/BaseButton";

const { handleResponse } = appConstants;

const RecentApplicants = ({
  selectedTechnology,
  onResetFilter,
}: {
  selectedTechnology: string | null;
  onResetFilter: () => void;
}) => {
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRecentApplicants();
  }, [selectedTechnology]); // Refetch when technology changes

  const fetchRecentApplicants = async () => {
    setIsLoading(true);
    try {
      const data = await getRecentApplications(selectedTechnology || undefined); // Pass filter
      setRecentApplicants(data?.data?.item || []);
      // setTotalRecords(data?.data?.totalRecords || []);
    } catch (error) {
      errorHandle(error);
      console.log("Error loading recent applicants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async (filtered: string[]) => {
    try {
      toast.info("Preparing file for download...");
      await new Promise((resolve) => setTimeout(resolve, 3500));

      const decodedSkills = filtered.map((skill) => decodeURIComponent(skill));

      const response = await ExportSkilledApplicant(
        { skills: filtered },
        { ids: [], fields: [], main: true }
      );

      if (!response) {
        toast.error("Failed to download file");
        return;
      }

      const blob = new Blob([response], { type: "text/csv" });
      const safeFileName = decodedSkills.join("-").replace(/[\\/\\?%*:|"<>]/g, "");
       saveAs(blob, `${safeFileName}-applicants.csv`);

      toast.success("File downloaded successfully!");
    } catch (error) {
      errorHandle(error);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr.No",
        cell: getSerialNumber,
        enableColumnFilter: false,
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info: any) => {
          const nameObj = info.row.original?.name || {};
          return `${nameObj.firstName || ""} ${nameObj.lastName || ""}`.trim();
        },
        enableColumnFilter: false,
      },
      {
        header: "applied Skills",
        accessorKey: "appliedSkills",
        cell: (cell: any) => (
          <div
            className="truncated-text"
            style={truncateText}
            title={cell.row.original.appliedSkills?.join(", ")}
          >
            {cell.row.original.appliedSkills?.join(", ")}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: "Experience",
        accessorKey: "totalExperience",
        enableColumnFilter: false,
      },
    ],
    [recentApplicants]
  );

  const technologyLabelMap: Record<string, string> = {
    "C%2B%2B": "C++",
    "C%23": "C#",
    FullStack: "Full Stack",
  };

  const titleText =
    selectedTechnology && technologyLabelMap[selectedTechnology]
      ? technologyLabelMap[selectedTechnology]
      : selectedTechnology || "Recent";

  return (
    <Row className="mt-6">
      <Col>
        <Card className="w-full min-h-[390px]">
          <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center p-4  min-h-[63px]">
            <h4 className="h4 fw-bold text-dark">
              {titleText} Applicants
              {/* <p>Total Records:-{totalRecords}</p> */}
            </h4>

            {selectedTechnology && (
              <div className="justify-end gap-2 d-flex">
                <BaseButton color="primary" onClick={onResetFilter}>
                  Reset Filter
                </BaseButton>
                <BaseButton
                  color="success"
                  onClick={() => handleExportExcel([selectedTechnology])}
                >
                  <i className="ri-upload-2-line me-1" />
                  Export
                </BaseButton>
              </div>
            )}
          </Card.Header>
          <Card.Body className="pt-0">
            {isLoading ? (
              <div className="min-h-[390px] w-full">
                <Skeleton className="min-h-[390px]" />
              </div>
            ) : (
              <>
                {" "}
                {recentApplicants?.length > 0 ? (
                  <TableContainer
                    columns={columns}
                    data={recentApplicants}
                    theadClass="table-secondary text-white"
                    isPagination={false}
                    customPadding="0.3rem 1.5rem"
                  />
                ) : (
                  <div className="py-4 text-center">
                    <i className="ri-search-line d-block fs-1 text-success"></i>
                    {handleResponse?.dataNotFound}
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RecentApplicants;
const truncateText = {
  // display: "flex",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px",
  fontSize: "14px",
  // alignItems: "center",
  // justifyContent: "center",
  // height: "40px",
  // textAlign: "left",
};
