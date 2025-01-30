


import React, { useState } from "react";
import { Table, Button, Form, Container, Row, Col, Card, InputGroup, FormControl, Dropdown } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Menu, MenuItem, Button as MuiButton } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
// import { CiEdit,IoEyeOutline,MdDeleteOutline,RiResetLeftFill,CiFilter,CiExport  } from "react-icons/ci";

// Dummy data with added experience and date
interface Applicant {
  id: number;
  applicantsName: string;
  technology: string;
  priority: string;
  priorityBadgeBg: string;
  experience: number;
  dateApplied: string;
  operation: {
    edit: string;
    view: string;
    delete: string;
  };
  comments: {
    email: string;
    feedback: string;
  };
  status: string;
}

const ApplicantTable = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: 1,
      applicantsName: "John Doe",
      technology: "React.js",
      priority: "In-Process",
      priorityBadgeBg: "warning",
      experience: 3,
      dateApplied: "2025-01-15",
      operation: { edit: "edit", view: "View", delete: "Delete" },
      comments: { email: "johndoe@example.com", feedback: "Good front-end skills." },
      status: "Pending",
    },
    {
      id: 2,
      applicantsName: "Jane Smith",
      technology: "Node.js",
      priority: "Rejected",
      priorityBadgeBg: "danger",
      experience: 5,
      dateApplied: "2025-01-10",
      operation: { edit: "Edit", view: "View", delete: "Delete" },
      comments: { email: "janesmith@example.com", feedback: "Strong back-end experience." },
      status: "Interview Scheduled",
    },
    {
      id: 3,
      applicantsName: "Alice Johnson",
      technology: "Angular",
      priority: "Hold",
      priorityBadgeBg: "secondary",
      experience: 2,
      dateApplied: "2025-01-20",
      operation: { edit: "Edit", view: "View", delete: "Delete" },
      comments: { email: "alicej@example.com", feedback: "Good Angular knowledge." },
      status: "2nd Round Interview",
    },

    {
      "id": 4,
      "applicantsName": "Bob Green",
      "technology": "Vue.js",
      "priority": "In-Process",
      "priorityBadgeBg": "warning",
      "experience": 4,
      "dateApplied": "2025-01-12",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "bobgreen@example.com", "feedback": "Solid knowledge of front-end frameworks." },
      "status": "Pending"
    },
    {
      "id": 5,
      "applicantsName": "Emily White",
      "technology": "Python",
      "priority": "Accepted",
      "priorityBadgeBg": "success",
      "experience": 6,
      "dateApplied": "2025-01-18",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "emilywhite@example.com", "feedback": "Experienced in backend development and machine learning." },
      "status": "Offer Extended"
    },
    {
      "id": 6,
      "applicantsName": "Michael Brown",
      "technology": "Ruby on Rails",
      "priority": "In-Process",
      "priorityBadgeBg": "warning",
      "experience": 3,
      "dateApplied": "2025-01-05",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "michaelbrown@example.com", "feedback": "Great problem-solving skills." },
      "status": "Pending"
    },
    {
      "id": 7,
      "applicantsName": "Sarah Lee",
      "technology": "React.js",
      "priority": "Hold",
      "priorityBadgeBg": "secondary",
      "experience": 5,
      "dateApplied": "2025-01-17",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "sarahlee@example.com", "feedback": "Strong experience with React.js and Redux." },
      "status": "2nd Round Interview"
    },
    {
      "id": 8,
      "applicantsName": "Daniel Harris",
      "technology": "JavaScript",
      "priority": "Rejected",
      "priorityBadgeBg": "danger",
      "experience": 2,
      "dateApplied": "2025-01-22",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "danielharris@example.com", "feedback": "Needs more experience with JavaScript frameworks." },
      "status": "Rejected"
    },
    {
      "id": 9,
      "applicantsName": "Olivia Martinez",
      "technology": "Node.js",
      "priority": "In-Process",
      "priorityBadgeBg": "warning",
      "experience": 7,
      "dateApplied": "2025-01-11",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "oliviamartinez@example.com", "feedback": "Proficient in building scalable backend systems." },
      "status": "Pending"
    },
    {
      "id": 10,
      "applicantsName": "Lucas Taylor",
      "technology": "Django",
      "priority": "Accepted",
      "priorityBadgeBg": "success",
      "experience": 4,
      "dateApplied": "2025-01-09",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "lucastaylor@example.com", "feedback": "Great knowledge of web frameworks." },
      "status": "Offer Extended"
    },
    {
      "id": 11,
      "applicantsName": "Sophia Wilson",
      "technology": "Angular",
      "priority": "Hold",
      "priorityBadgeBg": "secondary",
      "experience": 6,
      "dateApplied": "2025-01-14",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "sophiawilson@example.com", "feedback": "Good at Angular and front-end development." },
      "status": "2nd Round Interview"
    },
    {
      "id": 12,
      "applicantsName": "James Moore",
      "technology": "Vue.js",
      "priority": "In-Process",
      "priorityBadgeBg": "warning",
      "experience": 3,
      "dateApplied": "2025-01-08",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "jamesmoore@example.com", "feedback": "Good knowledge of Vue.js and component-based architecture." },
      "status": "Pending"
    },
    {
      "id": 13,
      "applicantsName": "Charlotte Evans",
      "technology": "React.js",
      "priority": "Rejected",
      "priorityBadgeBg": "danger",
      "experience": 4,
      "dateApplied": "2025-01-13",
      "operation": { "edit": "Edit", "view": "View", "delete": "Delete" },
      "comments": { "email": "charlottevans@example.com", "feedback": "Lacked experience in React.js." },
      "status": "Rejected"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<number | "">("");
  const [dateFilterStart, setDateFilterStart] = useState("");
  const [dateFilterEnd, setDateFilterEnd] = useState("");


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const technologies = ["React.js", "Node.js", "Angular", "Vue.js"];


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredApplicants = applicants
    .filter((applicant) => {
      const searchInApplicant =
        applicant.applicantsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.experience.toString().includes(searchTerm.toLowerCase()) ||
        applicant.dateApplied.includes(searchTerm.toLowerCase());

      return searchInApplicant;
    })
    .filter((applicant) =>
      technologyFilter ? applicant.technology.toLowerCase().includes(technologyFilter.toLowerCase()) : true
    )
    .filter((applicant) =>
      experienceFilter ? applicant.experience >= experienceFilter : true
    )
    .filter((applicant) =>
      dateFilterStart && dateFilterEnd
        ? applicant.dateApplied >= dateFilterStart && applicant.dateApplied <= dateFilterEnd
        : true
    );


  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  const resetFilters = () => {
    setSearchTerm("");
    setTechnologyFilter("");
    setExperienceFilter("");
    setDateFilterStart("");
    setDateFilterEnd("");
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Applicant List", 20, 20);
    currentApplicants.forEach((applicant, index) => {
      doc.text(`${applicant.id}. ${applicant.applicantsName} - ${applicant.technology}`, 20, 30 + index * 10);
    });
    doc.save("applicants.pdf");
  };


  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(currentApplicants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");
    XLSX.writeFile(wb, "applicants.xlsx");
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

  return (
    <Container fluid>
      <Row className="mt-4 mb-3">
        {/* <Col md={8}>
          <h4 className="mb-0">Applicants</h4>
        </Col> */}
        <Col md={12} className="text-end">
          <Button variant="primary" onClick={() => alert("Add New Applicant")}>
            Add New Applicant
          </Button>

        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Header className="bg-white py-4">
          <Row>
            <Col md={2}>
              <Dropdown >
                <Dropdown.Toggle className="h-10"
                  variant="outline-secondary"
                  id="dropdown-basic">
                  {technologyFilter || "Technology"}
                </Dropdown.Toggle>
                <Dropdown.Menu >

                  {technologies.map((tech) => (
                    <Dropdown.Item key={tech} onClick={() => setTechnologyFilter(tech)}>
                      {tech}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={2}>
              <Form.Control
                as="select"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(Number(e.target.value) || "")}
              >
                <option value="">Experience</option>
                <option value="0">0+</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </Form.Control>
            </Col>
            <Col md={3}>
              <InputGroup>
                <Form.Control
                  type="date"
                  value={dateFilterStart}
                  onChange={(e) => setDateFilterStart(e.target.value)}
                />
                <Form.Control
                  type="date"
                  value={dateFilterEnd}
                  onChange={(e) => setDateFilterEnd(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2} className="d-flex justify-content-end">
              <Button variant="link" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Col>
            <Col md={3}>
              <div className="d-flex justify-content-end ">
                <MuiButton
                  variant="outlined"
                  color="primary"
                  endIcon={<MoreVertIcon />}
                  onClick={handleClick}
                >
                  Export
                </MuiButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { exportToPDF(); handleClose(); }}>
                    Export to PDF
                  </MenuItem>
                  <MenuItem onClick={() => { exportToExcel(); handleClose(); }}>
                    Export to Excel
                  </MenuItem>
                </Menu>
              </div>
            </Col>
          </Row>
        </Card.Header>
      </Card>

      <Card>
        <Card.Header className="bg-white py-4">
          <div className="d-flex justify-end text-end m-3 ">
            <div className="h-10 !w-xs ">
              <Form.Control className="!rounded-full"
                type="search"
                placeholder="Search by Anything"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div></div>
          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th className="font-bold">Sno.</th>
                <th className="font-bold">Applicant Name</th>
                <th className="font-bold">Technology</th>
                <th className="font-bold">Comments</th>
                <th className="font-bold">Interview Stage</th>
                <th className="font-bold">Status</th>
                <th className="font-bold">Operation</th>
              </tr>
            </thead>
            <tbody>
              {currentApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>{applicant.id}</td>
                  <td>{highlightText(applicant.applicantsName)}</td>
                  <td>{highlightText(applicant.technology)}</td>

                  <td>
                    <strong>Email:</strong> {applicant.comments.email}<br />
                    <strong>Feedback:</strong> {applicant.comments.feedback}
                  </td>
                  <td>{applicant.status}</td>
                  <td>
                    <span className={`badge bg-${applicant.priorityBadgeBg}`}>
                      {applicant.priority}
                    </span>
                  </td>
                  <td>
                    <Button variant="link" size="sm">{applicant.operation.edit}</Button>
                    <Button variant="link" size="sm">{applicant.operation.view}</Button>
                    <Button variant="link" size="sm">{applicant.operation.delete}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Header>
        <Card.Footer className="bg-white text-end justify-end">
          <Button variant="link" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </Button>
          <Button variant="link" disabled={currentPage === Math.ceil(filteredApplicants.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </Button>
        </Card.Footer>
      </Card>

      {/* Export Dropdown */}

    </Container>
  );
};

export default ApplicantTable;
