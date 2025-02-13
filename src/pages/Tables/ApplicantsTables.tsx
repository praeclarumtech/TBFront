

// import React, { useState, useEffect } from "react";
// import { Table, Button, Form, Container, Row, Col, Card, InputGroup, FormControl, Dropdown } from "react-bootstrap";
// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
// import { Menu, MenuItem, Button as MuiButton } from "@mui/material";
// import { MoreVert as MoreVertIcon, Edit as EditIcon, Visibility as ViewIcon, Delete as DeleteIcon } from "@mui/icons-material";
// import axios from "axios";


// const statusOptions = ["Hold", "Processing", "Selected", "Rejected","Pending"];
// const interviewStageOptions = ["1st Interview", "2nd Interview", "HR","Technical", "Final" ];

// interface Applicant {
//   id: number;
//   application_No:number;
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
//   interviewStage: string;
//   name:{
//     firstName: string,
//     lastName: string,
//     middleName: string,
//   };
//   phone: {
//     whatsappNumber: string ,
//     phoneNumber: string ,
//   },
//   appliedSkills:string;
//   totalExperience:number;
//   interview_Stage: string;

// }


// const ApplicantTable = () => {
//   const [applicants, setApplicants] = useState<Applicant[]>([]);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [technologyFilter, setTechnologyFilter] = useState("");
//   const [experienceFilter, setExperienceFilter] = useState<number | "">("");
//   const [dateFilterStart, setDateFilterStart] = useState("");
//   const [dateFilterEnd, setDateFilterEnd] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // const applicantName = name.firstName + " " + name.middleName + " " + name.lastName;

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/applicant/view");
//         setApplicants(response.data);
//       console.log(response.data);

//       } catch (error) {
//         console.error("Error fetching applicants:", error);
//       }
//     };
//     fetchApplicants();
//   }, []);

//   const filteredApplicants = applicants.filter(applicant => {

//     const searchMatch =
//       (applicant.applicantsName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (applicant.technology || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (applicant.comments.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (applicant.comments.feedback || "").toLowerCase().includes(searchTerm.toLowerCase());

//     const technologyMatch =
//       technologyFilter ? applicant.technology === technologyFilter : true;

//     const experienceMatch =
//       experienceFilter ? applicant.experience >= experienceFilter : true;

//     const dateMatch =
//       (!dateFilterStart || new Date(applicant.dateApplied) >= new Date(dateFilterStart)) &&
//       (!dateFilterEnd || new Date(applicant.dateApplied) <= new Date(dateFilterEnd));

//     return searchMatch && technologyMatch && experienceMatch && dateMatch;
//   });

//   const currentApplicants = filteredApplicants.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//     setCurrentPage(1); 
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setTechnologyFilter("");
//     setExperienceFilter("");
//     setDateFilterStart("");
//     setDateFilterEnd("");
//     setCurrentPage(1); 
//   };

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleStatusChange = (applicantId: number, status: string) => {
//     setApplicants(prevApplicants =>
//       prevApplicants.map(applicant =>
//         applicant.id === applicantId ? { ...applicant, status } : applicant
//       )
//     );
//   };

//   const handleInterviewStageChange = (applicantId: number, interviewStage: string) => {
//     setApplicants(prevApplicants =>
//       prevApplicants.map(applicant =>
//         applicant.id === applicantId ? { ...applicant, interviewStage } : applicant
//       )
//     );
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Applicant List", 20, 20);
//     applicants.forEach((applicant, index) => {
//       doc.text(`${applicant.id}. ${applicant.applicantsName} - ${applicant.technology}`, 20, 30 + index * 10);
//     });
//     doc.save("applicants.pdf");
//   };

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(applicants);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Applicants");
//     XLSX.writeFile(wb, "applicants.xlsx");
//   };

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

//   return (
//     <Container fluid>
//       <Row className="mt-4 mb-3">
//         <Col md={12} className="text-end">
//           <MuiButton
//             variant="outlined"
//             color="primary"
//             endIcon={<MoreVertIcon />}
//             onClick={handleClick}
//           >
//             Actions
//           </MuiButton>
//           <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//             <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
//             <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
//             <MenuItem onClick={() => alert("Add New Applicant")}>Add New Applicant</MenuItem>
//           </Menu>
//         </Col>
//       </Row>

//       <Card className="mb-3">
//         <Card.Header className="bg-white py-4">
//           <Row>
//             <Col md={2}>
//               <Dropdown>
//                 <Dropdown.Toggle variant="outline-secondary">
//                   {technologyFilter || "Technology"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => setTechnologyFilter("React.js")}>React.js</Dropdown.Item>
//                   <Dropdown.Item onClick={() => setTechnologyFilter("Node.js")}>Node.js</Dropdown.Item>
//                   <Dropdown.Item onClick={() => setTechnologyFilter("Angular")}>Angular</Dropdown.Item>
//                   <Dropdown.Item onClick={() => setTechnologyFilter("Vue.js")}>Vue.js</Dropdown.Item>
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
//             <Col md={3}>
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
//             <Col md={2} className="d-flex justify-content-end">
//               <Button variant="link" onClick={resetFilters}>
//                 Reset Filters
//               </Button>
//             </Col>
//           </Row>
//         </Card.Header>
//       </Card>

//       <Card>
//         <Card.Header className="bg-white py-4">
//           <div className="d-flex justify-end text-end m-3">
//             <Form.Control
//               className="!rounded-full"
//               type="search"
//               placeholder="Search by Anything"
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>

//           <Table responsive className="text-nowrap mb-0">
//             <thead className="table-light mx-0">
//               <tr>

//                 <th className="font-bold">Applicant Name</th>
//                 <th className="font-bold mx-0">Technology</th>
//                 <th className="font-bold mx-0">Experience</th>
//                 <th className="font-bold mx-0">Comments</th>
//                 <th className="font-bold mx-0">Interview Stage</th>
//                 <th className="font-bold mx-0">Status</th>
//                 <th className="font-bold mx-0">Operation</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentApplicants.map((applicant) => (
//                 <tr key={applicant.id}>
//                   {/* <td>{applicant.application_No
//                   }</td> */}
//                   <td>{highlightText(applicant.name.firstName)}</td>
//                   <td>{highlightText(applicant.appliedSkills)}</td>
//                   <td>{applicant.totalExperience}</td>
//                   <td>
//                     <strong className="text-primary">Email </strong> |  
//                     <strong className="text-primary"> Feedback</strong> 
//                   </td>
//                   <td>
//                     <Dropdown className="">
//                       <Dropdown.Toggle variant="outline-secondary" className="p-1 mx-0">
//                         {applicant.interview_Stage}
//                       </Dropdown.Toggle>
//                       <Dropdown.Menu>
//                         {interviewStageOptions.map((stage) => (
//                           <Dropdown.Item key={stage} onClick={() => handleInterviewStageChange(applicant.id, stage)}>
//                             {stage}
//                           </Dropdown.Item>
//                         ))}
//                       </Dropdown.Menu>
//                     </Dropdown>
//                   </td>
//                   <td>
//                     <Dropdown >
//                       <Dropdown.Toggle variant="outline-secondary" className="p-1 mx-0">
//                         {applicant.status}
//                       </Dropdown.Toggle>
//                       <Dropdown.Menu>
//                         {statusOptions.map((status) => (
//                           <Dropdown.Item key={status} onClick={() => handleStatusChange(applicant.id, status)}>
//                             {status}
//                           </Dropdown.Item>
//                         ))}
//                       </Dropdown.Menu>
//                     </Dropdown>
//                   </td>
//                   <td>
//                     <EditIcon color="primary" />
//                     <ViewIcon color="info" />
//                     <DeleteIcon color="error" />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Header>
//         <Card.Footer className="bg-white text-end justify-end">
//           <Button
//             variant="link"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(currentPage - 1)}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="link"
//             disabled={currentPage === Math.ceil(applicants.length / itemsPerPage)}
//             onClick={() => setCurrentPage(currentPage + 1)}
//           >
//             Next
//           </Button>
//         </Card.Footer>
//       </Card>

//     </Container>
//   );
// };

// export default ApplicantTable;


import React, { useState, useEffect } from "react";
import { Table, Form, Container, Row, Col, Card, InputGroup, Modal, Dropdown, Pagination } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Menu, MenuItem, Button as MuiButton } from "@mui/material";
import { MoreVert as MoreVertIcon, Edit as EditIcon, Visibility as ViewIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import { Button, Typography } from '@mui/material';
import UpdateModal from "./EditApplicantModal";




const statusOptions = ["Hold", "Processing", "Selected", "Rejected", "Pending"];
const interviewStageOptions = ["1st Interview", "2nd Interview", "HR", "Technical", "Final"];

interface Applicant {
  fullAddress: string;
  //  __id: any, value: string): void;
  dateOfBirth: string;
  _id: number;
  application_No: number;
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
  status: string;
  interview_Stage: string;
  name: {
    firstName: string;
    lastName: string;
    middleName: string;
  };
  phone: {
    whatsappNumber: string;
    phoneNumber: string;
  };
  appliedSkills: string;
  totalExperience: number;
  email: string;
  feedback: string;
  current_Location: string;
  state: string;
  country: string;
  pincode: string;
  city: string;
  qualification: string;
  degree: string;
  passingYear: string;
  otherskills: string;
  resume: string;
  url: string;
  relevantSkillExperience: string;
  rating: string;
  currentpkg: string;
  expectedpkg: string;
  noticePeriod: string;
  negotiation: string;
  readyForWork: string;
  workPreference: string;
  aboutus: string;
  created_At: string;
  referal: string;
  gender: string;
}

const ApplicantTable = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<number | "">("");
  const [dateFilterStart, setDateFilterStart] = useState("");
  const [dateFilterEnd, setDateFilterEnd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    fetchApplicants();
  }, []);

  // const fetchApplicants = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/api/applicant/view");
  //     setApplicants(response.data);
  //   } catch (error) {
  //     console.error("Error fetching applicants:", error);
  //   }
  // };

  const handleDelete = async (_id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/applicant/delete/${_id}`);
      fetchApplicants();
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/applicant/view/${id}`);
      setSelectedApplicant(response.data);
    } catch (error) {
      console.error("Error fetching applicant details:", error);
    }
  };

  const handleStatusChange = async (applicantId: string, status: string) => {
    try {

      console.log("mydata--------------------");
      console.log("mydata", applicantId);

      await axios.put(`http://localhost:5000/api/applicant/update/${applicantId}`, { status: status });
      fetchApplicants();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleInterviewStageChange = async (applicantId: string, interviewStage: string) => {
    try {
      console.log("mydata--------------------");
      console.log("mydata", applicantId);
      await axios.put(`http://localhost:5000/api/applicant/update/${applicantId}`, { interview_Stage: interviewStage });
      fetchApplicants();
    } catch (error) {
      console.error("Error updating interview stage:", error);
    }
  };

  // const handleSaveEdit = async () => {
  //   if (!editingApplicant) return;
  //   try {
  //     await axios.put(`http://localhost:5000/api/applicant/update/${editingApplicant._id}`, editingApplicant);
  //     fetchApplicants();
  //     setEditingApplicant(null);
  //   } catch (error) {
  //     console.error("Error updating applicant:", error);
  //   }
  // };

  // Filtering and pagination logic remains same as before
  // ... (keep all the filtering and pagination logic unchanged)

  const filteredApplicants = applicants.filter(applicant => {

    const searchMatch =
      (applicant.applicantsName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.technology || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.feedback || "").toLowerCase().includes(searchTerm.toLowerCase());

    const technologyMatch =
      technologyFilter ? applicant.technology === technologyFilter : true;

    const experienceMatch =
      experienceFilter ? applicant.experience >= experienceFilter : true;

    const dateMatch =
      (!dateFilterStart || new Date(applicant.dateApplied) >= new Date(dateFilterStart)) &&
      (!dateFilterEnd || new Date(applicant.dateApplied) <= new Date(dateFilterEnd));

    return searchMatch && technologyMatch && experienceMatch && dateMatch;
  });

  const currentApplicants = filteredApplicants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log("current", currentApplicants);


  // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(event.target.value);
  //   setCurrentPage(1);
  // };

  // const resetFilters = () => {
  //   setSearchTerm("");
  //   setTechnologyFilter("");
  //   setExperienceFilter("");
  //   setDateFilterStart("");
  //   setDateFilterEnd("");
  //   setCurrentPage(1);
  // };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    fetchApplicants({
      searchTerm,
      technology: technologyFilter,
      experience: experienceFilter,
      dateFilterStart,
      dateFilterEnd,
    });
  };

  const handleTechnologyFilter = (technology: string) => {
    setTechnologyFilter(technology);
    fetchApplicants({
      searchTerm,
      technology,
      experience: experienceFilter,
      dateFilterStart,
      dateFilterEnd,
    });
  };

  const handleExperienceFilter = (experience: number | "") => {
    setExperienceFilter(experience);
    fetchApplicants({
      searchTerm,
      technology: technologyFilter,
      experience,
      dateFilterStart,
      dateFilterEnd,
    });
  };

  const handleDateFilter = (start: string, end: string) => {
    setDateFilterStart(start);
    setDateFilterEnd(end);
    fetchApplicants({
      searchTerm,
      technology: technologyFilter,
      experience: experienceFilter,
      dateFilterStart: start,
      dateFilterEnd: end,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTechnologyFilter("");
    setExperienceFilter("");
    setDateFilterStart("");
    setDateFilterEnd("");
    fetchApplicants({}); // Fetch all applicants without filters
  };

  const fetchApplicants = async (filters = {}, page = 1, limit = itemsPerPage) => {
    try {
      const response = await axios.get("http://localhost:5000/api/applicant/view", {
        params: { ...filters, page, limit },
      });
      setApplicants(response.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Applicant List", 20, 20);
    applicants.forEach((applicant, index) => {
      doc.text(`${applicant.id}. ${applicant.applicantsName} - ${applicant.technology}`, 20, 30 + index * 10);
    });
    doc.save("applicants.pdf");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(applicants);
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

  console.log(showModal)
  return (
    <Container fluid>

      <Row className="mt-4 mb-3">
        <Col md={12} className="text-end">
          <MuiButton
            variant="outlined"
            color="primary"
            endIcon={<MoreVertIcon />}
            onClick={handleClick}
          >
            Actions
          </MuiButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
            <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
            <MenuItem onClick={() => alert("Add New Applicant")}>Add New Applicant</MenuItem>
          </Menu>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Header className="bg-white py-4">
          <Row>
            <Col md={2}>
              <Dropdown >
                <Dropdown.Toggle variant="outline-secondary " className="m-0 md:p-1 sm:p-0">
                  {technologyFilter || "Technology"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="m-0">
                  <Dropdown.Item onClick={() => handleTechnologyFilter("React.js")}>React.js</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleTechnologyFilter("Node.js")}>Node.js</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleTechnologyFilter("Angular")}>Angular</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleTechnologyFilter("Vue.js")}>Vue.js</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={2}>
              <Form.Control
                as="select"
                value={experienceFilter}
                onChange={(e) => handleExperienceFilter(Number(e.target.value) || "")}
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
                  onChange={(e) => handleDateFilter(e.target.value, dateFilterEnd)}
                />
                <Form.Control
                  type="date"
                  value={dateFilterEnd}
                  onChange={(e) => handleDateFilter(dateFilterStart, e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2} className="d-flex justify-content-end">
              <Button variant="link" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Card.Header>

      </Card>

      <Card>
        <Card.Header className="bg-white py-4">

          <Row>
            <Col md={4} sm={6} xs={12}>
              <div className=" m-3">
                <Form.Control
                  className="!rounded-full"
                  type="search"
                  placeholder="Search by Anything"
                  value={searchTerm} onChange={handleSearch}
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
                  <td>{`${highlightText(applicant.name.firstName)} ${highlightText(applicant.name.lastName)}`}</td>
                  <td>{highlightText(applicant.appliedSkills)}</td>
                  <td>{applicant.totalExperience}</td>
                  <td >
                    <strong className="text-primary">Email</strong><br></br>
                    <strong className="text-primary"> Feedback</strong>
                  </td>
                  <td>
                    <Form.Select className="p-1 m-0 !bg-red-600 text-white"
                      value={applicant.interview_Stage}
                      onChange={(e) => handleInterviewStageChange(applicant._id, e.target.value)}
                    >
                      {interviewStageOptions.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      value={applicant.status} className="p-1 m-0"
                      onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>

                    <EditIcon
                      color="primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        console.log("Editing Applicant:", applicant); // Debugging line
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

          {/* View Modal */}

          <Modal
            show={!!selectedApplicant}
            onHide={() => setSelectedApplicant(null)}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} // Optional: to add a dark background overlay
          >
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full overflow-auto">
              <Modal.Header closeButton>
                <Modal.Title>Applicant Details</Modal.Title>
              </Modal.Header>

              <Modal.Body className="p-4">
                {selectedApplicant && (
                  <>
                    {/* Personal Details Section */}
                    <Typography variant="h7" className="mx-5 font-bold text-2xl text-blue-600">
                      <i className="fa fa-user m-2" />
                      Personal Details:
                    </Typography>
                    <hr className="text-blue-900 font-extrabold mb-4" />

                    <div className="mx-2 p-3">
                      <Row>
                        <Col xs={12} md={6} className="mb-3">
                          <Typography variant="body1" className="text-gray-600">
                            <span className="font-extrabold text-base text-black">Name: </span>
                            <span>{selectedApplicant.name.firstName} {selectedApplicant.name.middleName} {selectedApplicant.name.lastName}</span>
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Phone Number:</span>
                            {selectedApplicant.phone.phoneNumber}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Date of Birth:</span>
                            {selectedApplicant.dateOfBirth}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Country:</span>
                            {selectedApplicant.country}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Pincode:</span>
                            {selectedApplicant.pincode}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">City:</span>
                            {selectedApplicant.city}
                          </Typography>
                        </Col>

                        <Col xs={12} md={6} className="mb-3">
                          <Typography>
                            <span className="font-extrabold text-base text-black">Email:</span>
                            {selectedApplicant.email}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">WhatsApp Number:</span>
                            {selectedApplicant.phone.whatsappNumber}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Gender:</span>
                            {selectedApplicant.gender}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">State:</span>
                            {selectedApplicant.state}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Full Address:</span>
                            {selectedApplicant.fullAddress}
                          </Typography>
                        </Col>
                      </Row>
                    </div>

                    {/* Educational Details Section */}
                    <Typography variant="h7" className="mx-5 font-bold text-2xl text-blue-600">
                      <i className="fa fa-graduation-cap m-2" />
                      Educational Details:
                    </Typography>
                    <hr className="text-blue-900 font-extrabold mb-4" />

                    <div className="mx-2 p-2">
                      <Row>
                        <Col xs={12} md={6} className="mb-3">
                          <Typography>
                            <span className="font-extrabold text-base text-black">Degree:</span>
                            {selectedApplicant.degree}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Total Experience:</span>
                            {selectedApplicant.totalExperience}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Qualification:</span>
                            {selectedApplicant.qualification}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Other Skills:</span>
                            {selectedApplicant.otherskills}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Url:</span>
                            {selectedApplicant.url}
                          </Typography>
                        </Col>

                        <Col xs={12} md={6}>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Passing Year:</span>
                            {selectedApplicant.passingYear}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Relevant Skill Experience:</span>
                            {selectedApplicant.relevantSkillExperience}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Applied Skills:</span>
                            {selectedApplicant.appliedSkills}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Resume:</span>
                            {selectedApplicant.resume}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Rating:</span>
                            {selectedApplicant.rating}
                          </Typography>
                        </Col>
                      </Row>
                    </div>

                    {/* Job Details Section */}
                    <Typography variant="h7" className="mx-5 font-bold text-2xl text-blue-600">
                      <i className="fa fa-briefcase m-2" />
                      Job Details:
                    </Typography>
                    <hr className="text-blue-900 font-extrabold mb-4" />

                    <div className="mx-2 p-3">
                      <Row>
                        <Col xs={12} md={6} className="mb-3">
                          <Typography>
                            <span className="font-extrabold text-base text-black">Expected Package:</span>
                            {selectedApplicant.expectedpkg}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Negotiation:</span>
                            {selectedApplicant.negotiation}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">About Us:</span>
                            {selectedApplicant.aboutus}
                          </Typography>
                        </Col>

                        <Col xs={12} md={6}>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Current Package:</span>
                            {selectedApplicant.currentpkg}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Notice Period:</span>
                            {selectedApplicant.noticePeriod}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Work Preference:</span>
                            {selectedApplicant.readyForWork}
                          </Typography>
                          <Typography>
                            <span className="font-extrabold text-base text-black">Ready for Work from Office:</span>
                            {selectedApplicant.workPreference}
                          </Typography>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </Modal.Body>
            </div>
          </Modal>



          {/* Edit Modal */}
          <UpdateModal
            show={showModal}
            onHide={() => setShowModal(false)}
            editingApplicant={editingApplicant}
            fetchApplicants={fetchApplicants}
          />
        </Card.Header>


        <Pagination className="justify-end text-end m-2 ">
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
          {Array.from({ length: Math.ceil(applicants.length / itemsPerPage) }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
        </Pagination>
      </Card>
    </Container>
  );
};

export default ApplicantTable;