import { useEffect, useMemo, useState } from "react";
import TableContainer from "components/BaseComponents/TableContainer";
import { Col, Row, Card, Button } from "react-bootstrap";
import { getRecentApplications } from "api/dashboardApi";
import appConstants from "constants/constant";
import { getSerialNumber } from "utils/commonFunctions";
import Skeleton from "react-loading-skeleton";

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
          return `${nameObj.firstName || ""} ${nameObj.middleName || ""} ${
            nameObj.lastName || ""
          }`.trim();
        },
        enableColumnFilter: false,
      },
      {
        header: "Technology",
        accessorKey: "appliedSkills",
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
        <Card>
          <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center p-4">
            <h4 className="h4">{selectedTechnology} Applicants</h4>
            {selectedTechnology && (
              <Button variant="primary" onClick={onResetFilter}>
                Reset Filter
              </Button>
            )}
          </Card.Header>
          <Card.Body>
            {isLoading ? (
              <div className="min-h[400px] w-full">
                <Skeleton className="min-h-[400px]" />
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
