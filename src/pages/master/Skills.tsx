// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   TextField,
//   Input,
// } from "@mui/material";

// // import { Persons } from "./Name";
// import "./index.css"

// const marginLeft = {
//   position: "bottom",
//   marginLeft: "20px",
// };

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "8px",
// };

// const AddSkill = () => {
//   const [open, setOpen] = useState(false);
//   const [skill, setSkill] = useState("");
//   const [search, setSearch] = useState("");
//   const [skillList, setSkillList] = useState(
//     Persons.map((item, index) => ({ id: index + 1, name: item.name }))
//   );

//   const listOfYearsApi = "http://localhost:3000/listOfYears";

//   const [user, setUser] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handelDelete = async (id) => {
//     console.log("id : -", id);
//     setIsLoading(true);
//     try {
//       const response = await fetch(listOfYearsApi.concat("/") + id, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to delete item");
//       }
//       setUser(user.filter((item) => item.id !== id));
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getSkills();
//   }, []);

//   const getSkills = () => {
//     axios
//       .get(listOfYearsApi)
//       .then((res) => {
//         setUser(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const handleAddSkill = () => {
//     if (
//       skill &&
//       !skillList.some((item) => item.name.toLowerCase() === skill.toLowerCase())
//     ) {
//       setSkillList([...skillList, { id: skillList.length + 1, name: skill }]);
//     }
//     console.log("Skill Added:", skill);
//     setSkill("");
//     setOpen(false);
//   };

//   const handleChange = (e) => {
//     setSearch(e.target.value.toLowerCase());
//     setOpen(false);
//   };

//   const filterSkills = skillList.filter((item) =>
//     item.name.toLowerCase().includes(search)
//   );

//   const handleDelete = (idToDelete) => {
//     const updatedList = skillList
//       .filter((item) => item.id !== idToDelete)
//       .map((item, index) => ({ ...item, id: index + 1 })); // Reassign IDs

//     setSkillList(updatedList);
//   };
//   return (
//     <Box sx={{ textAlign: "center", mt: 4 }}>
//       <Typography
//         sx={{
//           fontSize: "25px",
//           float: "left",
//           marginLeft: "20px",
//           fontWeight: "bold",
//         }}
//       >
//         Add DropDown Items of Skill
//       </Typography>

//       <Button variant="contained" onClick={() => setOpen(true)}>
//         <i className="fa-solid fa-plus"></i> Add
//       </Button>

//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" gutterBottom>
//             Skill Name
//           </Typography>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Write down skill"
//             value={skill}
//             onChange={(e) => setSkill(e.target.value)}
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleAddSkill}
//             >
//               Add
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => setOpen(false)}
//             >
//               Close
//             </Button>
//           </Box>
//         </Box>
//       </Modal>

//       <Box sx={{ mt: 4 }}>
//         <TextField
//           sx={{ marginRight: "-50%" }}
//           id="standard-basic"
//           label="Quick Search"
//           variant="standard"
//           onChange={handleChange}
//           onClose={() => setOpen(false)}
//         />
//         <Typography
//           sx={{
//             fontSize: "25px",
//             float: "left",
//             marginLeft: "20px",
//             fontWeight: "bold",
//           }}
//         >
//           Skills
//         </Typography>{" "}
//         <table
//           className="tbl-container custom-table"
//           style={{
//             marginTop: "20px",
//             width: "100%",
//             borderCollapse: "collapse",
//           }}
//         >
//           <thead>
//             <tr>
//               <th>Sr.no</th>
//               <th>Skill</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filterSkills.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDelete(item.id)}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Box>
//       <Box
//         sx={{
//           inline: "true",
//           textAlign: "center",
//           mt: 2,
//           position: "bottom",
//         }}
//       >
//         <Typography>
//           Totals:-
//           <Input
//             sx={marginLeft}
//             placeholder="Number of Fields"
//             value={skillList.length}
//             readOnly
//           />
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default AddSkill;

// import  { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   TextField,
//   Input,
// } from "@mui/material";
// import axios from "axios";
// import "./index.css";

// const marginLeft = {
//   position: "bottom",
//   marginLeft: "20px",
// };

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "8px",
// };

// const BASE_URL = import.meta.env.VITE_API_URL;

// const viewSkillApi = `${BASE_URL}/api/skill/viewSkills/`;
// const createSkillApi = `${BASE_URL}/api/skill/addSkills/`;
// const deleteSkillApi = (_id) => `${BASE_URL}/api/skill/delete`;
// const updateSkillApi = (_id) => `${BASE_URL}/api/skill/update`;
// const viewSkillById = (_id) => `${BASE_URL}/api/skill/viewById`;

// const AddSkill = () => {
//   const [open, setOpen] = useState(false);
//   const [skills, setSkills] = useState("");
//   const [search, setSearch] = useState("");
//   // const [skillList, setSkillList] = useState([]);
//   const [skillList, setSkillList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingSkill, setEditingSkill] = useState(null);

//   useEffect(() => {
//     fetchSkills();
//   }, []);

//   // const fetchSkills = () => {
//   //   setIsLoading(true);
//   //   axios
//   //     .get(viewSkillApi)
//   //     .then((res) => {
//   //       setSkillList(res.data);
//   //     })
//   //     .catch((err) => {
//   //       console.error("Error fetching skills:", err);
//   //       setError("Failed to fetch skills.");
//   //     })
//   //     .finally(() => {
//   //       setIsLoading(false);
//   //     });
//   // };

//   const fetchSkills = () => {
//     setIsLoading(true);
//     axios
//       .get(viewSkillApi)
//       .then((res) => {
//         // Check if the response is an array before setting it
//         if (Array.isArray(res.data)) {
//           setSkillList(res.data);
//           console.log("mydata", res.data);
//         } else {
//           console.error("Expected an array of skills, but got:", res.data);
//           setError('Failed to fetch skills. Invalid response.');
//         }
//       })

//       .catch((err) => {
//         console.error("Error fetching skills:", err);
//         setError("Failed to fetch skills.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const handleAddSkill = () => {
//     if (skills.trim()) {
//       axios
//         .post(createSkillApi, { name: skills })
//         .then((res) => {
//           // Ensure res.data is in the expected format (it should be an object, not an array)
//           if (res.data && res.data.id) {
//             setSkillList([...skillList, res.data]);
//             setSkills("");
//             setOpen(false);
//           } else {
//             console.error("Invalid response after adding skill:", res.data);
//             setError("Failed to add skill.");
//           }
//         })
//         .catch((err) => {
//           console.error("Error adding skill:", err);
//           setError("Failed to add skill.");
//         });
//     }
//   };

//   const handleUpdateSkill = () => {
//     if (skills.trim() && editingSkill) {
//       axios
//         .put(`${updateSkillApi}/${editingSkill.id}`, { name: skills })
//         .then((res) => {
//           const updatedList = skillList.map((item) =>
//             item.id === editingSkill.id ? res.data : item
//           );
//           setSkillList(updatedList);
//           setSkills("");
//           setEditingSkill(null);
//           setOpen(false);
//         })
//         .catch((err) => {
//           console.error("Error updating skill:", err);
//           setError("Failed to update skill.");
//         });
//     }
//   };

//   const handleDeleteSkill = (id) => {
//     setIsLoading(true);
//     axios
//       .delete(`${deleteSkillApi}/${id}`)
//       .then(() => {
//         setSkillList(skillList.filter((item) => item.id !== id));
//       })
//       .catch((err) => {
//         console.error("Error deleting skill:", err);
//         setError("Failed to delete skill.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value.toLowerCase());
//   };

//   const filteredSkills = Array.isArray(skillList)
//     ? skillList.filter((item) => item.name.toLowerCase().includes(search))
//     : [];

//   const openEditModal = (skills) => {
//     setSkills(skills.name);
//     setEditingSkill(skills);
//     setOpen(true);
//   };

//   return (
//     <Box sx={{ textAlign: "center", mt: 4 }} className="frm-container">
//       <Typography
//         sx={{
//           fontSize: "25px",
//           float: "left",
//           marginLeft: "20px",
//           fontWeight: "bold",
//         }}
//         className="lbl-tlt"
//       >
//         Add/Update DropDown Items of Skill
//       </Typography>

//       <Button
//         variant="contained"
//         onClick={() => setOpen(true)}
//         className="btnAdd-year"
//       >
//         <i className="fa fa-solid fa-plus"></i> Add
//       </Button>

//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={modalStyle} className="modal-content">
//           <Typography variant="h6" gutterBottom>
//             Skill Name
//           </Typography>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Write down skill"
//             value={skills}
//             onChange={(e) => setSkills(e.target.value)}
//             className="inp-pasy"
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
//               className="btn-Add"
//             >
//               {editingSkill ? "Update" : "Add"}
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => setOpen(false)}
//               className="btn-cancle"
//             >
//               Close
//             </Button>
//           </Box>
//         </Box>
//       </Modal>

//       <Box sx={{ mt: 4 }} className="tbl-div">
//         <TextField
//           sx={{ marginRight: "-50%" }}
//           id="standard-basic"
//           label="Quick Search"
//           variant="standard"
//           onChange={handleSearchChange}
//           className="quick-search"
//         />
//         <Typography
//           sx={{
//             fontSize: "25px",
//             float: "left",
//             marginLeft: "20px",
//             fontWeight: "bold",
//           }}
//           className="txt-pasy"
//         >
//           Skills
//         </Typography>

//         <table
//           className="tbl-container custom-table"
//           style={{
//             marginTop: "20px",
//             width: "100%",
//             borderCollapse: "collapse",
//           }}
//         >
//           <thead>
//             <tr>
//               <th>Sr.no</th>
//               <th>Skill</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSkills.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={() => openEditModal(item)}
//                     className="btn-edit"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDeleteSkill(item.id)}
//                     className="btn-delete"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Deleting..." : "Delete"}
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Box>

//       <Box
//         sx={{ inline: "true", textAlign: "center", mt: 2 }}
//         className="div-tlt"
//       >
//         <Typography>
//           Totals:-{" "}
//           <Input
//             sx={marginLeft}
//             placeholder="Number of Fields"
//             value={filteredSkills.length}
//             readOnly
//             className="inp-tlt"
//           />
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default AddSkill;

// import { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   TextField,
//   Input,
// } from "@mui/material";
// import axios from "axios";
// import "./index.css";
// import { Card, Col, Row } from "react-bootstrap";

// const marginLeft = {
//   position: "bottom",
//   marginLeft: "20px",
// };

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "8px",
// };

// const BASE_URL = import.meta.env.VITE_API_URL;

// const viewSkillApi = `${BASE_URL}/api/skill/viewSkills/`;
// const createSkillApi = `${BASE_URL}/api/skill/addSkills/`;
// const deleteSkillApi = (_id) => `${BASE_URL}/api/skill/delete`;
// const updateSkillApi = (_id) => `${BASE_URL}/api/skill/update`;
// const viewSkillById = (_id) => `${BASE_URL}/api/skill/viewById`;

// const AddSkill = () => {
//   const [open, setOpen] = useState(false);
//   const [skills, setSkills] = useState("");
//   const [search, setSearch] = useState("");
//   const [skillList, setSkillList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingSkill, setEditingSkill] = useState(null);

//   useEffect(() => {
//     fetchSkills();
//   }, []);

//   const fetchSkills = () => {
//     setIsLoading(true);
//     axios
//       .get(viewSkillApi)
//       .then((res) => {
//         if (res.data && Array.isArray(res.data.data.getskills)) {
//           setSkillList(res.data.data.getskills); // Accessing the 'data' object first
//           console.log("Fetched skills:", res.data.data.getskills);
//         } else {
//           console.error("Invalid response format", res.data);
//           setError("Failed to fetch skills.");
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching skills:", err);
//         setError("Failed to fetch skills.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const handleAddSkill = () => {
//     if (skills.trim()) {
//       axios
//         .post(createSkillApi, { skills })
//         .then((res) => {
//           if (res.data && res.data._id) {
//             setSkillList([...skillList, res.data]);
//             setSkills("");
//             setOpen(false);
//           } else {
//             console.error("Invalid response after adding skill:", res.data);
//             setError("Failed to add skill.");
//           }
//         })
//         .catch((err) => {
//           console.error("Error adding skill:", err);
//           setError("Failed to add skill.");
//         });
//     }
//   };

//   const handleUpdateSkill = () => {
//     if (skills.trim() && editingSkill) {
//       axios
//         .put(`${updateSkillApi}/${editingSkill._id}`, { skills })
//         .then((res) => {
//           const updatedList = skillList.map((item) =>
//             item._id === editingSkill._id ? res.data : item
//           );
//           setSkillList(updatedList);
//           setSkills("");
//           setEditingSkill(null);
//           setOpen(false);
//         })
//         .catch((err) => {
//           console.error("Error updating skill:", err);
//           setError("Failed to update skill.");
//         });
//     }
//   };

//   const handleDeleteSkill = (id) => {
//     setIsLoading(true);
//     axios
//       .delete(`${deleteSkillApi}/${id}`)
//       .then(() => {
//         setSkillList(skillList.filter((item) => item._id !== id));
//       })
//       .catch((err) => {
//         console.error("Error deleting skill:", err);
//         setError("Failed to delete skill.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value.toLowerCase());
//   };

//   const filteredSkills = Array.isArray(skillList)
//     ? skillList.filter((item) => item.skills.toLowerCase().includes(search))
//     : [];

//   const openEditModal = (skill) => {
//     setSkills(skill.skills);
//     setEditingSkill(skill);
//     setOpen(true);
//   };

//   const highlightText = (text) => {
//     if (!search) return text;
//     const parts = text.split(new RegExp(`(${search})`, "gi"));
//     return parts.map((part, index) =>
//       part.toLowerCase() === search.toLowerCase() ? (
//         <span key={index} style={{ backgroundColor: "#ffff00" }}>
//           {part}
//         </span>
//       ) : (
//         part
//       )
//     );
//   };

//   return (
//     <Row className="mb-8 m-5">
//       <Col xl={12} lg={12} md={12} xs={12}>
//         <Card>
//           <Card.Body>
//             <Box sx={{ textAlign: "center", mt: 4 }} className="frm-container">
//               <Typography
//                 sx={{
//                   fontSize: "25px",
//                   float: "left",
//                   marginLeft: "20px",
//                   fontWeight: "bold",
//                 }}
//                 className="lbl-tlt"
//               >
//                 Add/Update DropDown Items of Skill
//               </Typography>
//               {/* <Button
//                 variant="contained"
//                 onClick={() => setOpen(true)}
//                 className="btnAdd-year"
//               >
//                 <i className="fa fa-solid fa-plus"></i> Add
//               </Button> */}

//               <div className="justify-end text-end ">
//                 <Button
//                   variant="contained"
//                   onClick={() => setOpen(true)}
//                   className="px-5 !py-2 !bg-blue-600 !hover:bg-primary btnAdd-year !outline-none !text-white"
//                 >
//                   <i className=" fa fa-solid fa-plus text-white py-2"> Add</i>
//                 </Button>
//               </div>

//               <Modal open={open} onClose={() => setOpen(false)}>
//                 <Box sx={modalStyle} className="modal-content">
//                   <Typography variant="h6" gutterBottom>
//                     Skill Name
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     // variant="outlined"
//                     placeholder="Write down skill"
//                     value={skills}
//                     onChange={(e) => setSkills(e.target.value)}
//                     className="inp-pasy outline-none"
//                   />
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       mt: 2,
//                     }}
//                   >
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={
//                         editingSkill ? handleUpdateSkill : handleAddSkill
//                       }
//                       className="btn-Add px-4 py-2 !bg-red-600 !hover:bg-denger
//                         !outline-none !text-white"
//                     >
//                       {editingSkill ? "Update" : "Add"}
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="secondary"
//                       onClick={() => setOpen(false)}
//                       className="btn-cancle px-4 py-1 !bg-blue-600 !hover:bg-primary !outline-none !text-white"
//                     >
//                       Close
//                     </Button>
//                   </Box>
//                 </Box>
//               </Modal>

//               {/* <Box sx={{ mt: 4 }} className="tbl-div"> */}
//               <Box sx={{ mt: 4 }} className="">
//                 <div className=" ">
//                   <TextField
//                     sx={{ marginRight: "-50%" }}
//                     id="standard-basic"
//                     label="Quick Search"
//                     variant="standard"
//                     onChange={handleSearchChange}
//                     className="quick-search "
//                   />
//                 </div>
//                 <Typography
//                   sx={{
//                     fontSize: "25px",
//                     float: "left",
//                     marginLeft: "20px",
//                     fontWeight: "bold",
//                   }}
//                   // className="txt-pasy"
//                   className=""
//                 >
//                   Skills
//                 </Typography>
//                 <div className="overflow-hidden">

//                 {error && <Typography color="error">{error}</Typography>}
//                 <table
//                   className="tbl-container custom-table"
//                   style={{
//                     marginTop: "20px",
//                     width: "100%",
//                     borderCollapse: "collapse",
//                   }}
//                 >
//                   <thead>
//                     <tr>
//                       <th>Sr.no</th>
//                       <th>Skill</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredSkills.map((item, index) => (
//                       <tr key={item._id}>
//                         <td>{index + 1}</td>
//                         <td>{highlightText(item.skills)}</td>
//                         <td className="flex justify-center space-x-2 text-center">
//                           <Button
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => openEditModal(item)}
//                             className=" btn-edit px-4 py-1 !bg-blue-600 !hover:bg-primary !outline-none !text-white"
//                           >
//                             Edit
//                           </Button>
//                           <Button
//                             variant="outlined"
//                             color="error"
//                             onClick={() => handleDeleteSkill(item._id)}
//                             className="btn-delete px-4 py-1 !bg-red-600 !hover:bg-denger !outline-none !text-white "
//                             disabled={isLoading}
//                           >
//                             {isLoading ? "Deleting..." : "Delete"}
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   </table>
//                   </div>
//                 </Box>
//               </Box>

//               <Box
//                 sx={{ inline: "true", textAlign: "center", mt: 2 }}
//                 className="div-tlt"
//               >
//                 <Typography>
//                   Totals:-{" "}
//                   <Input
//                     sx={marginLeft}
//                     placeholder="Number of Fields"
//                     value={filteredSkills.length}
//                     readOnly
//                     className="inp-tlt"
//                   />
//                 </Typography>
//               </Box>
//             </Box>
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   );
// };

// export default AddSkill;

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Input,
} from "@mui/material";
import axios from "axios";
import "./index.css";
import { Card, Col, Row } from "react-bootstrap";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const marginLeft = {
  position: "bottom",
  marginLeft: "20px",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const BASE_URL = import.meta.env.VITE_API_URL;

const viewSkillApi = `${BASE_URL}/api/skill/viewSkills/`;
const createSkillApi = `${BASE_URL}/api/skill/addSkills/`;
// const deleteSkillApi = (_id) => `${BASE_URL}/api/skill/delete`;
// const updateSkillApi = (_id) => `${BASE_URL}/api/skill/update`;
const viewSkillById = (_id) => `${BASE_URL}/api/skill/viewById`;

const AddSkill = () => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState("");
  const [search, setSearch] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    setIsLoading(true);
    axios
      .get(viewSkillApi)
      .then((res) => {
        if (res.data && Array.isArray(res.data.data.getskills)) {
          setSkillList(res.data.data.getskills); // Accessing the 'data' object first
          console.log("Fetched skills:", res.data.data.getskills);
        } else {
          console.error("Invalid response format", res.data);
          setError("Failed to fetch skills.");
           toast.error("Failed to fetch skills.!", {
             position: "top-right",
             autoClose: 3000,
           });
        }
      })
      .catch((err) => {
        console.error("Error fetching skills:", err);
        setError("Failed to fetch skills.");
        toast.error("Failed to fetch skills.!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddSkill = () => {
    if (skills.trim()) {
      axios
        .post(createSkillApi, { skills })
        .then((res) => {
          if (res.data && res.data._id) {
            setSkillList([...skillList, res.data]);
            setSkills("");
            setOpen(false);
              toast.success("Applicant deleted successfully!", {
                position: "top-right",
                autoClose: 3000,
              });
          } else {
            console.error("Invalid response after adding skill:", res.data);
            setError("Failed to add skill.");
            toast.error("Failed to add skill.!", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        })
        .catch((err) => {
          console.error("Error adding skill:", err);
          setError("Failed to add skill.");
          toast.error("Failed to add skill.!", {
            position: "top-right",
            autoClose: 3000,
          });
        });
      
    }
  };

  const handleUpdateSkill = () => {
    if (skills.trim() && editingSkill) {
      axios
        .put(`${BASE_URL}/api/skill/update/${editingSkill._id}`, { skills })
        .then((res) => {
          const updatedList = skillList.map((item) =>
            item._id === editingSkill._id ? res.data : item
          );
          setSkillList(updatedList);
          setSkills("");
          setEditingSkill(null);
          setOpen(false);
          toast.success("Skill updated successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          console.error("Error updating skill:", err);
          setError("Failed to update skill.");
          toast.error("Failed to update skill.!", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    }
  };

  const handleDeleteSkill = (_id) => {
    setIsLoading(true);
    axios
      .delete(`${BASE_URL}/api/skill/delete/${_id}`)
      .then(() => {
        setSkillList(skillList.filter((item) => item._id !== _id));
        toast.success("Applicant deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        console.error("Error deleting skill:", err);
        setError("Failed to delete skill.");
        toast.error("Failed to delete skill.!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setIsLoading(false);

      });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredSkills = Array.isArray(skillList)
    ? skillList.filter((item) => item.skills.toLowerCase().includes(search))
    : [];

  const openEditModal = (skill) => {
    setSkills(skill.skills);
    setEditingSkill(skill);
    setOpen(true);

  };

  const highlightText = (text) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "#ffff00" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Row className="m-5">
      <Col xl={12} lg={12} md={12} xs={12}>
        <Card className="">
          <Card.Body>
            <Box sx={{ textAlign: "center", mt: 0 }} className="frm-container">
              <Typography
                sx={{
                  fontSize: "20px",
                  float: "left",
                  marginLeft: "20px",
                  fontWeight: "bold",
                }}
                className="lbl-tlt"
              >
                Add DropDown Items of Skill
              </Typography>
              <Box className="" sx={{ textAlign: "center", mt: 4 }}>
                <div className="justify-end text-end mx-5">
                  <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    className="px-5 !py-2 !bg-blue-600 !hover:bg-primary mx-5 !outline-none !text-white"
                  >
                    <i className="fa fa-solid fa-plus text-white py-2"> Add</i>
                  </Button>
                </div>

                <Modal open={open} onClose={() => setOpen(false)}>
                  <Box sx={modalStyle} className="modal-content">
                    <Typography variant="h6" gutterBottom>
                      Skill Name
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Write down skill"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="inp-pasy outline-none"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={
                          editingSkill ? handleUpdateSkill : handleAddSkill
                        }
                        className="btn-Add px-4 py-2 !bg-red-600 !hover:bg-denger !outline-none !text-white"
                      >
                        {editingSkill ? "Update" : "Add"}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpen(false)}
                        className="btn-cancle px-4 py-1 !bg-blue-600 !hover:bg-primary !outline-none !text-white"
                      >
                        Close
                      </Button>
                    </Box>
                  </Box>
                </Modal>

                <Box sx={{ mt: 2 }} className="">
                  <div className="mx-5 justify-end text-end">
                    <TextField
                      sx={{ marginRight: "" }}
                      id="standard-basic"
                      label="Quick Search"
                      variant="standard"
                      onChange={handleSearchChange}
                      className="!quick-search 
                    "
                    />
                  </div>
                  <Typography className="justify-start text-left "
                    sx={{
                      fontSize: "25px",
                      marginLeft: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    Skills
                  </Typography>

                  {error && <Typography color="error">{error}</Typography>}

                  <div className="overflow-hidden">
                    <table
                      className="tbl-container custom-table"
                      style={{
                        marginTop: "20px",
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Sr.no</th>
                          <th>Skill</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredSkills.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{highlightText(item.skills)}</td>
                            <td className="flex justify-center space-x-2 text-center">
                              <EditIcon
                                variant="outlined"
                                style={{ cursor: "pointer" }}
                                color="primary"
                                onClick={() => openEditModal(item)}
                                // className="btn-edit px-4 py-1 !bg-blue-600 !hover:bg-primary !outline-none !text-white"
                                className="mx-2"
                              >
                                Edit
                              </EditIcon>
                              <DeleteIcon
                                variant="outlined"
                                color="error"
                                style={{ cursor: "pointer", marginLeft: 8 }}
                                onClick={() => handleDeleteSkill(item._id)}
                                // className="btn-delete px-4 py-1 !bg-red-600 !hover:bg-denger !outline-none !text-white "
                                disabled={isLoading}
                              >
                                {isLoading ? "Deleting..." : "Delete"}
                              </DeleteIcon>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Box>

                <Box
                  sx={{ inline: "true", textAlign: "center", mt: 2 }}
                  className="div-tlt"
                >
                  <Typography>
                    Totals:-{" "}
                    <Input
                      sx={marginLeft}
                      placeholder="Number of Fields"
                      value={filteredSkills.length}
                      readOnly
                      className="inp-tlt"
                    />
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AddSkill;
