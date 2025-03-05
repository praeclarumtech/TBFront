import { useEffect, useMemo, useState } from "react";
import TableContainer from "components/BaseComponents/TableContainer";
import { Col, Row, Card } from "react-bootstrap";
import { getRecentApplications } from "api/dashboardApi";
import appConstants from "constants/constant";
import { getSerialNumber } from "utils/commonFunctions";

const { handleResponse } = appConstants;

const RecentApplicants = () => {
  const [recentApplicants, setRecentApplicants] = useState([]);

  useEffect(() => {
    fetchRecentApplicants();
  }, []);

  const fetchRecentApplicants = async () => {
    try {
      const data = await getRecentApplications();
      setRecentApplicants(data?.data?.item || []);
      console.log("data", data);
    } catch (error) {
      console.log("Error loading recent applicants");
    }
  };

  const column = useMemo(
    () => [
      {
        header: "ID",
        cell: getSerialNumber,
        enableColumnFilter: false,
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (info:any) => {
          const nameObj = info.row.original?.name || {}; 
          const firstName = nameObj.firstName || "";
          const middleName = nameObj.middleName || "";
          const lastName = nameObj.lastName || "";

          return `${firstName} ${middleName} ${lastName}`.trim(); 
        },
        enableColumnFilter: false,
      },
      {
        header: "Technolog",
        accessorKey: "appliedSkills",
        enableColumnFilter: false,
      },
      {
        header: "Exprience",
        accessorKey: "totalExperience",
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <>
      <Row className="mt-6">
        <Col>
          <Card>
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center ">
              <h4 className="h4">Recent Applicants </h4>
            </Card.Header>
            <Card.Body>
              <div className="card-body pt-0">
                <div>
                  {recentApplicants?.length > 0 ? (
                    <TableContainer
                      columns={column}
                      data={recentApplicants ? recentApplicants : []}
                      theadClass="table-secondary text-white"
                      isPagination={false}
                    />
                  ) : (
                    <div className="py-4 text-center">
                      <i className="ri-search-line d-block fs-1 text-success"></i>
                      {handleResponse?.dataNotFound}
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RecentApplicants;
