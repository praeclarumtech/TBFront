// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   TextField,
//   Input,
// } from "@mui/material";
// // import { Years } from "D:/pt/development/src/Years";
// import "D:/pt/development/src/App.css";
// import axios from "axios";

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

// const CodeBlock = ({ code }) => {
//   return (
//     <Box
//       sx={{
//         position: "relative",
//         p: 2,
//         bgcolor: "#f5f5f5",
//         borderRadius: "8px",
//         mt: 2,
//       }}
//     >
//       <Typography
//         component="pre"
//         sx={{ fontSize: "14px", whiteSpace: "pre-wrap" }}
//       >
//         {code}
//       </Typography>
//     </Box>
//   );
// };

// // const Model = () => {
// //   const [open, setOpen] = useState(false);
// //   const [AYear, setAYear] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [error, setError] = useState("");
// //   const [yearList, setYearList] = useState(
// //     Years.map((item, index) => ({ id: index + 1, year: item.year }))
// //   );

// //   // console.log(Years);

// //   const handleAddYear = () => {
// //     if (!AYear.trim()) {
// //       setError("Year cannot be Empty");
// //       return;
// //     }
// //     if (isNaN(AYear)) {
// //       setError("Please Enter Valid year");
// //       return;
// //     }
// //     if (AYear.length !== "4") {
// //       setError("Please Enter Four digit Year");
// //       return;
// //     }
// //     if (AYear && !yearList.some((item) => item.year === parseInt(AYear))) {
// //       setYearList([
// //         ...yearList,
// //         { id: yearList.length + 1, year: parseInt(AYear) },
// //       ]);
// //     }

// //     console.log("Year Added:", AYear);
// //     console.log(yearList);
// //     setAYear("");
// //     setError("");
// //     setOpen(false);
// //   };

// //   const handleChange = (e) => {
// //     setSearch(e.target.value.toLowerCase());
// //   };

// //   // Filter years based on search input
// //   const filteredYears = yearList.filter((item) =>
// //     item.year.toString().includes(search)
// //   );

// //   const handleDelete = (idToDelete) => {
// //     const updatedList = yearList
// //       .filter((item) => item.id !== idToDelete)
// //       .map((item, index) => ({ ...item, id: index + 1 })); // Reassign IDs

// //     setYearList(updatedList);
// //   };

// const CreateYear = () => {
//   const [search, setSearch] = useState("");

//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const createYearApi = "http://192.168.1.11:3000/api/year/";

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [aYear, setAYear] = useState({
//     id: "",
//     year: "",
//   });

//   const marginLeft = {
//     marginLeft: "20px",
//   };
//   useEffect(() => {
//     fetch("http://localhost:3000/api/year/listOfYears")
//       .then((response) => response.json())
//       .then((data) => setYearList(data))
//       .catch((error) => console.error("Error fetching years:", error));
//   }, []);
//   const handleInput = (event) => {
//     const { name, value } = event.target; // Use 'name' instead of 'year'
//     setAYear((prevState) => ({ ...prevState, [name]: value }));
//   };
//   const handleChange = (e) => {
//     setSearch(e.target.value.toLowerCase());
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Trim the input and validate
//     const yearValue = aYear.year.trim();

//     if (!yearValue) {
//       setError("Year cannot be empty");
//       return;
//     }
//     if (isNaN(yearValue)) {
//       setError("Please enter a valid numeric year");
//       return;
//     }
//     if (yearValue.length !== 4) {
//       setError("Please enter a four-digit year");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(""); // Reset error on valid input

//       const response = await fetch(createYearApi, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ year: parseInt(yearValue) }),
//       });

//       if (response.ok) {
//         console.log("Year added successfully");
//         setAYear({ id: "", year: "" });
//         navigate("/listOfYears");
//       } else {
//         console.log("Year was not added");
//       }
//     } catch (error) {
//       setError(error.message || "Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const [yearList, setYearList] = useState(
//     aYear.map((item, index) => ({ id: index + 1, year: item.year }))
//   );

//   return (
//     <Box sx={{ textAlign: "center", mt: 4 }}>
//       {/* {isLoading && <Loader />} */}
//       {error && <p>Error: {error}</p>}
//       <Typography
//         sx={{
//           fontSize: "25px",
//           float: "left",
//           marginLeft: "20px",
//           fontWeight: "bold",
//         }}
//       >
//         Add DropDown Items of Passing Year
//       </Typography>

//       <Button variant="contained" onClick={() => setOpen(true)}>
//         <i className="fa-solid fa-plus"></i> Add
//       </Button>

//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={modalStyle}>
//           <Typography variant="h6" gutterBottom>
//             Passing Year
//           </Typography>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Write Year Here..."
//             name="year"
//             value={aYear.year}
//             // maxlength="4"
//             onChange={handleInput}
//             error={!!error}
//             helperText={error}
//           />
//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSubmit}
//               disabled={!!error}
//               type="submit"
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
//         />
//         <Typography
//           sx={{
//             fontSize: "25px",
//             float: "left",
//             marginLeft: "20px",
//             fontWeight: "bold",
//           }}
//         >
//           Passing Year
//         </Typography>{" "}
//         {/* <table
//           className="tbl-container"
//           style={{
//             marginTop: "20px",
//             width: "100%",
//             borderCollapse: "collapse",
//           }}
//         >
//           <thead>
//             <tr>
//               <th>Sr.no</th>
//               <th>Years</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {yearList.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.id}</td>
//                 <td>{item.year}</td>
//                 <td>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     //   onClick={() => handleDelete(item.id)}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table> */}
//         <table
//           className="tbl-container"
//           style={{
//             marginTop: "20px",
//             width: "100%",
//             borderCollapse: "collapse",
//           }}
//         >
//           <thead>
//             <tr>
//               <th>Sr.no</th>
//               <th>Years</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {yearList.map((item, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{item.year}</td>
//                 <td>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     // onClick={() => }
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <Box
//           sx={{
//             inline: "true",
//             textAlign: "center",
//             mt: 2,
//             position: "bottom",
//           }}
//         >
//           <Typography>
//             Totals:-{" "}
//             <Input
//               sx={marginLeft}
//               placeholder="Number of Fields"
//               value={yearList.length}
//             ></Input>
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };
// export default CreateYear;

//api integration

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
import "D:/pt/development/src/App.css";

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

const CreateYear = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const createYearApi = "http://192.168.1.11:3000/api/year/";
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [yearList, setYearList] = useState([]); // ✅ Always default to an empty array
  const [aYear, setAYear] = useState({ id: "", year: "" });

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.11:3000/api/year/listOfYears"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      // ✅ Ensure it's an array before setting state
      if (Array.isArray(data)) {
        setYearList(data);
      } else {
        console.error("API did not return an array:", data);
        setYearList([]);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
      setYearList([]); // ✅ Prevents .map() error
    }
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setAYear((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const yearValue = aYear.year.trim();

    if (!yearValue) {
      setError("Year cannot be empty");
      return;
    }
    if (isNaN(yearValue)) {
      setError("Please enter a valid numeric year");
      return;
    }
    if (yearValue.length !== 4) {
      setError("Please enter a four-digit year");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(createYearApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: parseInt(yearValue) }),
      });

      if (response.ok) {
        const newYear = await response.json();
        setYearList([...yearList, newYear]); // ✅ Append to list
        setAYear({ id: "", year: "" });
        setOpen(false);
        setError("");
      } else {
        setError("Failed to add year");
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://192.168.1.11:3000/api/year/deleteYear/${id}`, // ✅ Fixed template string
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setYearList(yearList.filter((year) => year.id !== id)); // ✅ Remove from state
      } else {
        console.error("Failed to delete year");
      }
    } catch (error) {
      console.error("Error deleting year:", error);
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      {/* {error && <p style={{ color: "red" }}>Error: {error}</p>} */}
      <Typography
        sx={{
          fontSize: "25px",
          float: "left",
          marginLeft: "20px",
          fontWeight: "bold",
        }}
      >
        Add DropDown Items of Passing Year
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        <i className="fa-solid fa-plus"></i> Add
      </Button>

      {/* Add Year Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Passing Year
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write Year Here..."
            name="year"
            value={aYear.year}
            onChange={handleInput}
            error={!!error}
            helperText={error}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!!error || isLoading}
            >
              {isLoading ? "Adding..." : "Add"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Display Year List */}
      <Box sx={{ mt: 4 }}>
        <Typography
          sx={{
            fontSize: "25px",
            float: "left",
            marginLeft: "20px",
            fontWeight: "bold",
          }}
        >
          Passing Year
        </Typography>
        <TextField
          id="standard-basic"
          label="Quick Search"
          variant="standard"
          onChange={handleChange}
        />
        <table
          className="tbl-container"
          style={{
            marginTop: "20px",
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Sr.no</th>
              <th>Years</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(yearList) && yearList.length > 0 ? (
              yearList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.year}</td>
                  <td>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No years available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default CreateYear;
