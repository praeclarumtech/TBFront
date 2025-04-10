import { useEffect, useMemo, useState } from "react";
import TableContainer from "components/BaseComponents/TableContainer";
import { Col, Row, Card } from "react-bootstrap";
import { getRecentApplications } from "api/dashboardApi";
import appConstants from "constants/constant";
import { errorHandle, getSerialNumber } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";
import { ExportApplicant } from "api/applicantApi";
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
    } catch (error) {
      console.log("Error loading recent applicants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = async (filtered: string[]) => {
    try {
      toast.info("Preparing file for download...");
      await new Promise((resolve) => setTimeout(resolve, 3500));
      const response = await ExportApplicant(filtered);

      if (!response) {
        toast.error("Failed to download file");
        return;
      }

      const blob = new Blob([response], { type: "text/csv" });

      saveAs(blob, `${filtered}-applicants.csv`);

      toast.success("File downloaded successfully!");
    } catch (error) {
      // console.error("Export error:", error);
      errorHandle(error);
      // toast.error("Failed to export file");
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

  return (
    <Row className="mt-6">
      <Col>
        <Card className="w-full min-h-[390px]">
          <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center p-4  min-h-[63px]">
            <h4 className="h4">
              {selectedTechnology === "C%2B%2B"
                ? "C++"
                : selectedTechnology || "Recent"}{" "}
              Applicants
            </h4>

            {selectedTechnology && (
              <div className="d-flex justify-end gap-2">
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
