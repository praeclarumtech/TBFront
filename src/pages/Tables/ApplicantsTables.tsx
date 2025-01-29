



// import React, { useState, useEffect } from "react";
// import { Table, Button, Form, Container, Row, Col, Card, InputGroup, FormControl, Dropdown } from "react-bootstrap";

// // Dummy data with added experience and date
// interface Applicant {
//   id: number;
//   applicantsName: string;
//   technology: string;
//   priority: string;
//   priorityBadgeBg: string;
//   experience: number;
//   dateApplied: string;
//   operation: {
//     edit: string;
//     view: string;
//     delete: string;
//   };
//   comments: {
//     email: string;
//     feedback: string;
//   };
//   status: string;
// }

// const ApplicantTable = () => {
//   const [applicants, setApplicants] = useState<Applicant[]>([
//     {
//       id: 1,
//       applicantsName: "John Doe",
//       technology: "React.js",
//       priority: "Medium",
//       priorityBadgeBg: "warning",
//       experience: 3,
//       dateApplied: "2025-01-15",
//       operation: { edit: "Edit", view: "View", delete: "Delete" },
//       comments: { email: "johndoe@example.com", feedback: "Good front-end skills." },
//       status: "Pending",
//     },
//     {
//       id: 2,
//       applicantsName: "Jane Smith",
//       technology: "Node.js",
//       priority: "High",
//       priorityBadgeBg: "danger",
//       experience: 5,
//       dateApplied: "2025-01-10",
//       operation: { edit: "Edit", view: "View", delete: "Delete" },
//       comments: { email: "janesmith@example.com", feedback: "Strong back-end experience." },
//       status: "Interview Scheduled",
//     },
//     {
//       id: 3,
//       applicantsName: "Alice Johnson",
//       technology: "Angular",
//       priority: "Low",
//       priorityBadgeBg: "secondary",
//       experience: 2,
//       dateApplied: "2025-01-20",
//       operation: { edit: "Edit", view: "View", delete: "Delete" },
//       comments: { email: "alicej@example.com", feedback: "Good Angular knowledge." },
//       status: "Reviewed",
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [technologyFilter, setTechnologyFilter] = useState("");
//   const [experienceFilter, setExperienceFilter] = useState<number | "">("");
//   const [dateFilterStart, setDateFilterStart] = useState("");
//   const [dateFilterEnd, setDateFilterEnd] = useState("");
//   const [sortColumn, setSortColumn] = useState<keyof Applicant | null>(null);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const technologies = ["React.js", "Node.js", "Angular", "Vue.js"];

//   // Function to handle search
//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   // Function to handle sorting
//   const handleSort = (column: keyof Applicant) => {
//     const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
//     setSortColumn(column);
//     setSortOrder(order);

//     const sortedApplicants = [...applicants].sort((a, b) => {
//       if (a[column] < b[column]) return order === "asc" ? -1 : 1;
//       if (a[column] > b[column]) return order === "asc" ? 1 : -1;
//       return 0;
//     });
//     setApplicants(sortedApplicants);
//   };

//   // Filter applicants based on the search term, technology, experience, and date
//   const filteredApplicants = applicants
//     .filter((applicant) => {
//       const searchInApplicant =
//         applicant.applicantsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         applicant.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         applicant.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         applicant.experience.toString().includes(searchTerm.toLowerCase()) ||
//         applicant.dateApplied.includes(searchTerm.toLowerCase());

//       return searchInApplicant;
//     })
//     .filter((applicant) =>
//       technologyFilter ? applicant.technology.toLowerCase().includes(technologyFilter.toLowerCase()) : true
//     )
//     .filter((applicant) =>
//       experienceFilter ? applicant.experience >= experienceFilter : true
//     )
//     .filter((applicant) =>
//       dateFilterStart && dateFilterEnd
//         ? applicant.dateApplied >= dateFilterStart && applicant.dateApplied <= dateFilterEnd
//         : true
//     );

//   // Pagination logic
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentApplicants = filteredApplicants.slice(indexOfFirst, indexOfLast);

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setSearchTerm("");
//     setTechnologyFilter("");
//     setExperienceFilter("");
//     setDateFilterStart("");
//     setDateFilterEnd("");
//   };

//   return (
//     <Container fluid>
//       <Row className="mt-4 mb-3">
//         <Col md={8}>
//           <h4 className="mb-0">Applicants</h4>
//         </Col>
//         <Col md={4} className="text-end">
//           <Button variant="primary" onClick={() => alert("Add New Applicant")}>
//             Add New Applicant
//           </Button>
//         </Col>
//       </Row>

//       {/* Filter Section */}
//       <Card className="mb-3">
//         <Card.Header className="bg-white py-4">
//           <Row>
//             <Col md={3}>
//               <Form.Control
//                 type="search"
//                 placeholder="Search by Anything"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </Col>
//             <Col md={2}>
//               <Dropdown>
//                 <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
//                   {technologyFilter || "Technology"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   {technologies.map((tech) => (
//                     <Dropdown.Item key={tech} onClick={() => setTechnologyFilter(tech)}>
//                       {tech}
//                     </Dropdown.Item>
//                   ))}
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Col>
//             <Col md={2}>
//               <Form.Control
//                 as="select"
//                 value={experienceFilter}
//                 onChange={(e) => setExperienceFilter(Number(e.target.value) || "")}
//               >
//                 <option value="">Experience</option>
//                 <option value="0">0+</option>
//                 <option value="1">1+</option>
//                 <option value="2">2+</option>
//                 <option value="3">3+</option>
//               </Form.Control>
//             </Col>
//             <Col md={2}>
//               <InputGroup>
//                 <Form.Control
//                   type="date"
//                   value={dateFilterStart}
//                   onChange={(e) => setDateFilterStart(e.target.value)}
//                 />
//                 <Form.Control
//                   type="date"
//                   value={dateFilterEnd}
//                   onChange={(e) => setDateFilterEnd(e.target.value)}
//                 />
//               </InputGroup>
//             </Col>
//             <Col md={3} className="d-flex justify-content-end">
//               <Button variant="link" onClick={resetFilters}>
//                 Reset Filters
//               </Button>
//             </Col>
//           </Row>
//         </Card.Header>
//       </Card>

//       <Card>
//         <Card.Header className="bg-white py-4">
//           <Table responsive className="text-nowrap mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
//                   Sno.
//                 </th>
//                 <th
//                   onClick={() => handleSort("applicantsName")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   Applicant Name
//                 </th>
//                 <th
//                   onClick={() => handleSort("technology")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   Technology
//                 </th>
//                 <th>Operation</th>
//                 <th>Comments</th>
//                 <th
//                   onClick={() => handleSort("status")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   Status
//                 </th>
//                 <th
//                   onClick={() => handleSort("priority")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   Priority
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentApplicants.map((applicant) => (
//                 <tr key={applicant.id}>
//                   <td>{applicant.id}</td>
//                   <td>{applicant.applicantsName}</td>
//                   <td>{applicant.technology}</td>
//                   <td>
//                     <Button variant="link" size="sm">
//                       {applicant.operation.edit}
//                     </Button>
//                     <Button variant="link" size="sm">
//                       {applicant.operation.view}
//                     </Button>
//                     <Button variant="link" size="sm">
//                       {applicant.operation.delete}
//                     </Button>
//                   </td>
//                   <td>
//                     <strong>Email:</strong> {applicant.comments.email}
//                     <br />
//                     <strong>Feedback:</strong> {applicant.comments.feedback}
//                   </td>
//                   <td>{applicant.status}</td>
//                   <td>
//                     <span className={`badge bg-${applicant.priorityBadgeBg}`}>
//                       {applicant.priority}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Header>
//         <Card.Footer className="bg-white text-center">
//           <Button
//             variant="link"
//             disabled={currentPage === 1}
//             onClick={() => handlePageChange(currentPage - 1)}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="link"
//             disabled={currentPage === Math.ceil(filteredApplicants.length / itemsPerPage)}
//             onClick={() => handlePageChange(currentPage + 1)}
//           >
//             Next
//           </Button>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// };

// export default ApplicantTable;


// import React, { useState } from "react";
// import { Table, Button, Form, Container, Row, Col, Card, InputGroup, FormControl, Dropdown } from "react-bootstrap";
// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
// import { Menu, MenuItem, Button as MuiButton } from "@mui/material";
// import { MoreVert as MoreVertIcon } from "@mui/icons-material";

// // Dummy data with added experience and date
// interface Applicant {
//   id: number;
//   applicantsName: string;
//   technology: string;
//   priority: string;
//   priorityBadgeBg: string;
//   experience: number;
//   dateApplied: string;
//   operation: {
//     edit: string;
//     view: string;
//     delete: string;
//   };
//   comments: {
//     email: string;
//     feedback: string;
//   };
//   status: string;
// }

// const ApplicantTable = () => {
//   const [applicants, setApplicants] = useState<Applicant[]>([
//     {
//       id: 1,
//       applicantsName: "John Doe",
//       technology: "React.js",
//       priority: "Medium",
//       priorityBadgeBg: "warning",
//       experience: 3,
//       dateApplied: "2025-01-15",
//       operation: { edit: "Edit", view: "View", delete: "Delete" },
//       comments: { email: "johndoe@example.com", feedback: "Good front-end skills." },
//       status: "Pending",
//     },
//     {
//       id: 2,
//       applicantsName: "Jane Smith",
//       technology: "Node.js",
//       priority: "High",
//       priorityBadgeBg: "danger",
//       experience: 5,
//       dateApplied: "2025-01-10",
//       operation: { edit: "Edit", view: "View", delete: "Delete" },
//       comments: { email: "janesmith@example.com", feedback: "Strong back-end experience." },
//       status: "Interview Scheduled",
//     },
//     {
//       id: 3,
//       applicantsName: "Alice Johnson",
//       technology: "Angular",
//       priority: "Low",
//       priorityBadgeBg: "secondary",
//       experience: 2,
//       dateApplied: "2025-01-20",
//       operation: { edit: "Edit", view: "View", delete: "Delete" },
//       comments: { email: "alicej@example.com", feedback: "Good Angular knowledge." },
//       status: "Reviewed",
//     },
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [technologyFilter, setTechnologyFilter] = useState("");
//   const [experienceFilter, setExperienceFilter] = useState<number | "">("");
//   const [dateFilterStart, setDateFilterStart] = useState("");
//   const [dateFilterEnd, setDateFilterEnd] = useState("");

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const technologies = ["React.js", "Node.js", "Angular", "Vue.js"];

//   // Function to handle search
//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   // Filter applicants based on the search term, technology, experience, and date
//   const filteredApplicants = applicants
//     .filter((applicant) => {
//       const searchInApplicant =
//         applicant.applicantsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         applicant.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         applicant.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         applicant.experience.toString().includes(searchTerm.toLowerCase()) ||
//         applicant.dateApplied.includes(searchTerm.toLowerCase());

//       return searchInApplicant;
//     })
//     .filter((applicant) =>
//       technologyFilter ? applicant.technology.toLowerCase().includes(technologyFilter.toLowerCase()) : true
//     )
//     .filter((applicant) =>
//       experienceFilter ? applicant.experience >= experienceFilter : true
//     )
//     .filter((applicant) =>
//       dateFilterStart && dateFilterEnd
//         ? applicant.dateApplied >= dateFilterStart && applicant.dateApplied <= dateFilterEnd
//         : true
//     );

//   // Pagination logic
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentApplicants = filteredApplicants.slice(indexOfFirst, indexOfLast);

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setSearchTerm("");
//     setTechnologyFilter("");
//     setExperienceFilter("");
//     setDateFilterStart("");
//     setDateFilterEnd("");
//   };

//   // Highlight the search term
//   const highlightText = (text: string) => {
//     if (!searchTerm) return text;

//     const regex = new RegExp(`(${searchTerm})`, "gi");
//     const parts = text.split(regex);

//     return parts.map((part, index) =>
//       part.toLowerCase() === searchTerm.toLowerCase() ? (
//         <span key={index} style={{ backgroundColor: "yellow" }}>
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   // Export to PDF
//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Applicant List", 20, 20);
//     currentApplicants.forEach((applicant, index) => {
//       doc.text(`${applicant.id}. ${applicant.applicantsName} - ${applicant.technology}`, 20, 30 + index * 10);
//     });
//     doc.save("applicants.pdf");
//   };

//   // Export to Excel
//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(currentApplicants);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Applicants");
//     XLSX.writeFile(wb, "applicants.xlsx");
//   };

//   return (
//     <Container fluid>
//       <Row className="mt-4 mb-3">
//         <Col md={8}>
//           <h4 className="mb-0">Applicants</h4>
//         </Col>
//         <Col md={4} className="text-end">
//           <Button variant="primary" onClick={() => alert("Add New Applicant")}>
//             Add New Applicant
//           </Button>
//         </Col>
//       </Row>

//       {/* Filter Section */}
//       <Card className="mb-3">
//         <Card.Header className="bg-white py-4">
//           <Row>
//             <Col md={3}>
//               <Form.Control
//                 type="search"
//                 placeholder="Search by Anything"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </Col>
//             <Col md={2}>
//               <Dropdown>
//                 <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
//                   {technologyFilter || "Technology"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   {technologies.map((tech) => (
//                     <Dropdown.Item key={tech} onClick={() => setTechnologyFilter(tech)}>
//                       {tech}
//                     </Dropdown.Item>
//                   ))}
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Col>
//             <Col md={2}>
//               <Form.Control
//                 as="select"
//                 value={experienceFilter}
//                 onChange={(e) => setExperienceFilter(Number(e.target.value) || "")}
//               >
//                 <option value="">Experience</option>
//                 <option value="0">0+</option>
//                 <option value="1">1+</option>
//                 <option value="2">2+</option>
//                 <option value="3">3+</option>
//               </Form.Control>
//             </Col>
//             <Col md={2}>
//               <InputGroup>
//                 <Form.Control
//                   type="date"
//                   value={dateFilterStart}
//                   onChange={(e) => setDateFilterStart(e.target.value)}
//                 />
//                 <Form.Control
//                   type="date"
//                   value={dateFilterEnd}
//                   onChange={(e) => setDateFilterEnd(e.target.value)}
//                 />
//               </InputGroup>
//             </Col>
//             <Col md={3} className="d-flex justify-content-end">
//               <Button variant="link" onClick={resetFilters}>
//                 Reset Filters
//               </Button>
//             </Col>
//           </Row>
//         </Card.Header>
//       </Card>

//       <Card>
//         <Card.Header className="bg-white py-4">
//           <Table responsive className="text-nowrap mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>Sno.</th>
//                 <th>Applicant Name</th>
//                 <th>Technology</th>
//                 <th>Operation</th>
//                 <th>Comments</th>
//                 <th>Status</th>
//                 <th>Priority</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentApplicants.map((applicant) => (
//                 <tr key={applicant.id}>
//                   <td>{applicant.id}</td>
//                   <td>{highlightText(applicant.applicantsName)}</td>
//                   <td>{highlightText(applicant.technology)}</td>
//                   <td>
//                     <Button variant="link" size="sm">{applicant.operation.edit}</Button>
//                     <Button variant="link" size="sm">{applicant.operation.view}</Button>
//                     <Button variant="link" size="sm">{applicant.operation.delete}</Button>
//                   </td>
//                   <td>
//                     <strong>Email:</strong> {applicant.comments.email}<br />
//                     <strong>Feedback:</strong> {applicant.comments.feedback}
//                   </td>
//                   <td>{applicant.status}</td>
//                   <td>
//                     <span className={`badge bg-${applicant.priorityBadgeBg}`}>
//                       {applicant.priority}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Header>
//         <Card.Footer className="bg-white text-center">
//           <Button variant="link" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
//             Previous
//           </Button>
//           <Button variant="link" disabled={currentPage === Math.ceil(filteredApplicants.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
//             Next
//           </Button>
//         </Card.Footer>
//       </Card>

//       {/* Export buttons */}
//       {/* <div className="d-flex justify-content-end mt-4">
//         <Button variant="success" onClick={exportToPDF} className="me-2">
//           Export to PDF
//         </Button>
//         <Button variant="success" onClick={exportToExcel}>
//           Export to Excel
//         </Button>
//       </div> */}
//         {/* Export Dropdown */}
//         <div className="d-flex justify-content-end mt-4">
//         <MuiButton
//           variant="outlined"
//           color="primary"
//           endIcon={<MoreVertIcon />}
//           onClick={handleClick}
//         >
//           Export
//         </MuiButton>
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//         >
//           <MenuItem onClick={() => { exportToPDF(); handleClose(); }}>
//             Export to PDF
//           </MenuItem>
//           <MenuItem onClick={() => { exportToExcel(); handleClose(); }}>
//             Export to Excel
//           </MenuItem>
//         </Menu>
//       </div>
//     </Container>
//   );
// };

// export default ApplicantTable;


import React, { useState } from "react";
import { Table, Button, Form, Container, Row, Col, Card, InputGroup, FormControl, Dropdown } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Menu, MenuItem, Button as MuiButton } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

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
      priority: "Medium",
      priorityBadgeBg: "warning",
      experience: 3,
      dateApplied: "2025-01-15",
      operation: { edit: "Edit", view: "View", delete: "Delete" },
      comments: { email: "johndoe@example.com", feedback: "Good front-end skills." },
      status: "Pending",
    },
    {
      id: 2,
      applicantsName: "Jane Smith",
      technology: "Node.js",
      priority: "High",
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
      priority: "Low",
      priorityBadgeBg: "secondary",
      experience: 2,
      dateApplied: "2025-01-20",
      operation: { edit: "Edit", view: "View", delete: "Delete" },
      comments: { email: "alicej@example.com", feedback: "Good Angular knowledge." },
      status: "Reviewed",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<number | "">("");
  const [dateFilterStart, setDateFilterStart] = useState("");
  const [dateFilterEnd, setDateFilterEnd] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const technologies = ["React.js", "Node.js", "Angular", "Vue.js"];

  // Handle open/close of dropdown
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter applicants based on the search term, technology, experience, and date
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

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setTechnologyFilter("");
    setExperienceFilter("");
    setDateFilterStart("");
    setDateFilterEnd("");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Applicant List", 20, 20);
    currentApplicants.forEach((applicant, index) => {
      doc.text(`${applicant.id}. ${applicant.applicantsName} - ${applicant.technology}`, 20, 30 + index * 10);
    });
    doc.save("applicants.pdf");
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(currentApplicants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");
    XLSX.writeFile(wb, "applicants.xlsx");
  };

  // Highlight the search term
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
        <Col md={8}>
          <h4 className="mb-0">Applicants</h4>
        </Col>
        <Col md={4} className="text-end">
          <Button variant="primary" onClick={() => alert("Add New Applicant")}>
            Add New Applicant
          </Button>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card className="mb-3">
        <Card.Header className="bg-white py-4">
          <Row>
            <Col md={3}>
              <Form.Control
                type="search"
                placeholder="Search by Anything"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
            <Col md={2}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  {technologyFilter || "Technology"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
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
            <Col md={2}>
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
            <Col md={3} className="d-flex justify-content-end">
              <Button variant="link" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Card.Header>
      </Card>

      <Card>
        <Card.Header className="bg-white py-4">
          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th>Sno.</th>
                <th>Applicant Name</th>
                <th>Technology</th>
                <th>Operation</th>
                <th>Comments</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {currentApplicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>{applicant.id}</td>
                  <td>{highlightText(applicant.applicantsName)}</td>
                  <td>{highlightText(applicant.technology)}</td>
                  <td>
                    <Button variant="link" size="sm">{applicant.operation.edit}</Button>
                    <Button variant="link" size="sm">{applicant.operation.view}</Button>
                    <Button variant="link" size="sm">{applicant.operation.delete}</Button>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Header>
        <Card.Footer className="bg-white text-center">
          <Button variant="link" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </Button>
          <Button variant="link" disabled={currentPage === Math.ceil(filteredApplicants.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </Button>
        </Card.Footer>
      </Card>

      {/* Export Dropdown */}
      <div className="d-flex justify-content-end mt-4">
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
    </Container>
  );
};

export default ApplicantTable;
