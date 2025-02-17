


import { useState, useEffect } from "react";
import { Table, Form, Container, Row, Col, Card, InputGroup, Dropdown, Pagination } from "react-bootstrap";
import { Edit as EditIcon, Visibility as ViewIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { Button, Typography } from '@mui/material';
import UpdateModal from "./EditApplicantModal";
import { useNavigate } from "react-router-dom";
import ViewModal from "./ViewModal";
import { Applicant } from "../../types";



const statusOptions = ["Hold", "Processing", "Selected", "Rejected", "Pending"];
const interviewStageOptions = ["1st Interview", "2nd Interview", "HR", "Technical", "Final"];

const ApplicantTable = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<number | "">("");
  const [dateFilterStart, setDateFilterStart] = useState("");
  const [dateFilterEnd, setDateFilterEnd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async (filters = {}, page = 1, limit = itemsPerPage) => {
    try {
      const response = await axios.get("http://localhost:3000/api/applicants/viewAllApplicant", {
        
             params: { ...filters, page, limit },
           }
         );
      setApplicants(response.data.data.item);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/applicants/deleteApplicant/${_id}`);
      fetchApplicants();
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
  };


  const handleView = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/applicants/viewApplicant/${id}`);
     
      // Ensure the response data matches the expected structure
      const applicantData = {
        ...response.data,
        name: response.data.name || { firstName: "", middleName: "", lastName: "" },
        phone: response.data.phone || { phoneNumber: "", whatsappNumber: "" },
      };

      setSelectedApplicant(applicantData);
    } catch (error) {
      console.error("Error fetching applicant details:", error);
    }
  };



  const handleStatusChange = async (applicantId: string, status: string) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/applicants/updateApplicant/${applicantId}`, { status });
   
      fetchApplicants();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };



  const handleInterviewStageChange = async (applicantId: string, interviewStage: string) => {
    try {
      await axios.put(`http://localhost:3000/api/applicants/updateApplicant/${applicantId}`, { interviewStage });
      // Refetch applicants to update the UI
      fetchApplicants();
    } catch (error) {
      console.error("Error updating interview stage:", error);
    }
  };
  const filteredApplicants = applicants.filter(applicant => {
    const searchMatch =
      (applicant.name.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.appliedSkills.join(", ") || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const technologyMatch =
      technologyFilter ? applicant.appliedSkills.includes(technologyFilter) : true;

    const experienceMatch =
      experienceFilter ? applicant.totalExperience >= experienceFilter : true;

    const dateMatch =
      (!dateFilterStart || new Date(applicant.created_At) >= new Date(dateFilterStart)) &&
      (!dateFilterEnd || new Date(applicant.created_At) <= new Date(dateFilterEnd));

    return searchMatch && technologyMatch && experienceMatch && dateMatch;
  });

  const currentApplicants = filteredApplicants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchApplicants({
      searchTerm,
      technology: technologyFilter,
      experience: experienceFilter,
      dateFilterStart,
      dateFilterEnd,
    }, newPage, itemsPerPage);
  };

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };
console.log('====================================');
console.log(showModal);
console.log('====================================');
  return (
    <Container fluid>
      <Card className="mb-3 my-3">
        <Card.Header className="bg-white py-4">
          <Row className="g-3">
            <Col xs={12} sm={6} md={12} className="px-2">
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => navigate("/add_applicants")}
                  className="bg-primary text-white  py-2"
                >
                  Add New Applicant
                </Button>
              </div>
            </Col>
            {/* Technology Filter Dropdown */}
            <Col    md={10} className="px-2  flex   gap-4  "  >
              <Dropdown className=" w-fit flex px-4">
                <Dropdown.Toggle variant="outline-secondary" className="  w-full">
                  {technologyFilter || "Technology"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {["React.js", "Node.js", "Angular", "Vue.js"].map((tech) => (
                    <Dropdown.Item
                      key={tech}
                      onClick={() => setTechnologyFilter(tech)}
                    >
                      {tech}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {/* Experience Filter */}
              
                <Form.Select
                  value={experienceFilter}
                  onChange={(e) =>
                    setExperienceFilter(Number(e.target.value) || "")
                  }
                  className=" !w-fit px-2 py-2" // Added padding for better size
                >
                  <option value="">Experience</option>
                  {[0, 1, 2, 3].map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}+
                    </option>
                  ))}
                </Form.Select>
          
              {/* Date Range Filter */}
              
                <InputGroup className="w-100">
                  <Form.Control
                    type="date"
                    value={dateFilterStart}
                    onChange={(e) => setDateFilterStart(e.target.value)}
                    className="py-2" // Added padding for better size
                  />
                  <Form.Control
                    type="date"
                    value={dateFilterEnd}
                    onChange={(e) => setDateFilterEnd(e.target.value)}
                    className="py-2" // Added padding for better size
                  />
                </InputGroup>
            
            </Col>

            {/* Reset Filters Button */}
            <Col
              xs={12}
              sm={6}
              md={2}
              className="d-flex justify-content-end align-items-center px-2"
            >
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  setTechnologyFilter("");
                  setExperienceFilter("");
                  setDateFilterStart("");
                  setDateFilterEnd("");
                  fetchApplicants({});
                }}
                className="text-decoration-none py-2 text-primary"
              >
                Reset Filters
              </Button>
            </Col>

            {/* Add New Applicant Button */}
          </Row>
        </Card.Header>
      </Card>

      <Card>
        <Card.Header className="bg-white py-4">
          <Row>
            <Col md={4} sm={6} xs={12}>
              <div className="m-3">
                <Form.Control
                  className="!rounded-full"
                  type="search"
                  placeholder="Search by Anything"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
          </Row>

          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th>Applicant Name</th>
                <th>Technology</th>
                <th>Experience</th>
                <th>Comments</th>
                <th>Interview Stage</th>
                <th>Status</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {currentApplicants.map((applicant) => (
                <tr key={applicant._id}>
                  <td>{`${highlightText(
                    applicant.name.firstName
                  )} ${highlightText(applicant.name.lastName)}`}</td>
                  <td>{highlightText(applicant.appliedSkills.join(", "))}</td>
                  <td>{applicant.totalExperience}</td>
                  <td>
                    <strong className="text-primary">Email</strong>
                    <br />
                    <strong className="text-primary">Feedback</strong>
                  </td>
                  <td>
                    <Form.Select
                      className="p-1 m-0 !bg-red-600 text-white"
                      value={applicant.interviewStage}
                      onChange={(e) =>
                        handleInterviewStageChange(
                          applicant._id,
                          e.target.value
                        )
                      }
                    >
                      {interviewStageOptions.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      value={applicant.status}
                      className="p-1 m-0"
                      onChange={(e) =>
                        handleStatusChange(applicant._id, e.target.value)
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <EditIcon
                      color="primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditingApplicant(applicant);
                        setShowModal(true);
                      }}
                    />
                    <ViewIcon
                      color="info"
                      style={{ cursor: "pointer", marginLeft: 8 }}
                      onClick={() => handleView(applicant._id)}
                    />
                    <DeleteIcon
                      color="error"
                      style={{ cursor: "pointer", marginLeft: 8 }}
                      onClick={() => handleDelete(applicant._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

         

          <ViewModal
            show={!!selectedApplicant} // Ensure this is true when an applicant is selected
            onHide={() => setSelectedApplicant(null)}
            selectedApplicant={selectedApplicant}
          />

          <UpdateModal
            show={showModal}
            onHide={() => setShowModal(false)}
            editingApplicant={editingApplicant}
            fetchApplicants={fetchApplicants}
          />

          <Pagination className="justify-end text-end m-2">
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {Array.from(
              { length: Math.ceil(filteredApplicants.length / itemsPerPage) },
              (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              )
            )}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </Card.Header>
      </Card>
    </Container>
  );
};

export default ApplicantTable;


