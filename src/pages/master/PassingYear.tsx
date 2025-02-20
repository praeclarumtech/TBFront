// import { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   TextField,
//   Input,
// } from "@mui/material";
// import axios from "axios";

// const marginLeft = { marginLeft: "20px" };

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",console.log("Modal Opened");
// console.log("Error:", error);
// console.log("Year:", year);
// console.log("Year List:", yearList);
// console.log("Delete Year ID:", _id);
// console.log("Add Year Response:", response);
// console.log("Delete Year Response:", response.data);
// console.log("Get Years Response:", response.data.data.item);
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "8px",
// };

// const PassingYear = () => {
//   const [open, setOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [year, setYear] = useState("");
//   const [yearList, setYearList] = useState([]);
// git push origin applicant-ui-changes --force

//   const BASE_URL = import.meta.env.VITE_API_URL;
//   const viewYearApi = `${BASE_URL}/api/year/listOfYears/`;
//   const createYearApi = `${BASE_URL}/api/year`;
//   const deleteYearApi = (_id) => `${BASE_URL}/api/year/deleteYear/${_id}`;

//   useEffect(() => {
//     getYears();
//   }, []);

//   const getYears = async () => {
//     try {
//       const response = await axios.get(viewYearApi);
//       if (response.data.data.item && Array.isArray(response.data.data.item)) {
//         setYearList(response.data.data.item);
//         console.log("my response", response.data.data.item);
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };

//   const handleAddYear = async (event) => {
//     event.preventDefault();
//     if (!year) {
//       setError("Year is required");
//       return;
//     }

//     try {
//       const yearNumber = Number(year);

//       if (isNaN(yearNumber)) {
//         setError("Please enter a valid number");
//         return;
//       }

//       const response = await axios.post(createYearApi, { year: yearNumber });
//       setYear("");
//       setOpen(false);
//       getYears();
//     } catch (err) {
//       console.error("Error adding year:", err);
//     }
//   };

//   const handleDeleteYear = async (_id) => {
//     if (!_id) {
//       console.error("Invalid ID:", _id);
//       return;
//     }

//     try {
//       const response = await axios.delete(deleteYearApi(_id));
//       console.log("Delete Response:", response.data);
//       getYears();
//     } catch (err) {
//       console.error("Error deleting year:", err.response?.data || err.message);
//     }
//   };

//   const handleYearChange = (e) => {
//     setYear(e.target.value);
//     setError("");
//   };

//   return (
//     <Box sx={{ textAlign: "center", mt: 4 }}>
//       <Button variant="contained" onClick={() => setOpen(true)}>
//         <i className="fa-solid fa-plus"></i> Add
//       </Button>

//       <Modal open={open} onClose={() => setOpen(false)}>
//         <form onSubmit={handleAddYear}>
//           <Box sx={modalStyle}>
//             <Typography variant="h6" gutterBottom>
//               Passing Year
//             </Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Write Year Here..."
//               value={year}
//               onChange={handleYearChange}
//               error={!!error}
//               helperText={error}
//             />
//             <Box
//               sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
//             >
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={() => setOpen(false)}
//               >
//                 Close
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 type="submit"
//                 disabled={!!error || !year}
//               >
//                 Add
//               </Button>
//             </Box>
//           </Box>
//         </form>
//       </Modal>

//       <Box sx={{ mt: 4 }}>
//         <TextField
//           sx={{ marginRight: "-50%" }}
//           label="Quick Search"
//           variant="standard"
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
//               <th>Years</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {yearList.length > 0 ? (
//               yearList.map((item, i) => (
//                 <tr key={item._id}>
//                   <td>{i + 1}</td>
//                   <td>{item.year}</td>
//                   <td>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={() => handleDeleteYear(item._id)}
//                     >
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3">No data available</td>
//               </tr>
//             )}
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
//             Totals:{" "}
//             <Input
//               sx={marginLeft}
//               placeholder="Number of Fields"
//               value={yearList.length}
//               readOnly
//             />
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default PassingYear;

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Input,
} from "@mui/material";
import axios from "axios";

const PassingYear = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState("");
  const [yearList, setYearList] = useState([]);
  const [editingYearId, setEditingYearId] = useState(null); // To track which year is being edited

  const BASE_URL = import.meta.env.VITE_API_URL;
  const viewYearApi = `${BASE_URL}/api/year/listOfYears/`;
  const createYearApi = `${BASE_URL}/api/year`;
  const deleteYearApi = (_id) => `${BASE_URL}/api/year/deleteYear/${_id}`;
  const updateYearApi = (_id) => `${BASE_URL}/api/year/updateYear/${_id}`;
  const viewYearById = (_id) => `${BASE_URL}/api/year/getYearById/${_id}`;
  
  useEffect(() => {
    getYears();
  }, []);

  const getYears = async () => {
    try {
      const response = await axios.get(viewYearApi);
      if (response.data.data.item && Array.isArray(response.data.data.item)) {
        setYearList(response.data.data.item);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleAddYear = async (event) => {
    event.preventDefault();
    if (!year) {
      setError("Year is required");
      return;
    }

    try {
      const yearNumber = Number(year);
      if (isNaN(yearNumber)) {
        setError("Please enter a valid number");
        return;
      }

      if (editingYearId) {
        await handleUpdateYear(editingYearId, yearNumber);
      } else {
        await axios.post(createYearApi, { year: yearNumber }); 
      }

      setYear(""); // Clear input after adding/updating
      setOpen(false);
      setEditingYearId(null); // Reset editing state
      getYears(); // Refresh the year list
    } catch (err) {
      console.error("Error adding/updating year:", err);
    }
  };

  const handleDeleteYear = async (_id) => {
    if (!_id) {
      console.error("Invalid ID:", _id);
      return;
    }

    try {
      await axios.delete(deleteYearApi(_id));
      getYears(); // Refresh year list after delete
    } catch (err) {
      console.error("Error deleting year:", err);
    }
  };

  const handleUpdateYear = async (_id, newYear) => {
    try {
      await axios.put(updateYearApi(_id), { year: newYear });
      getYears(); 
    } catch (err) {
      console.error("Error updating year:", err);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setError("");
  };

  const handleEditYear = (id, year) => {
    setEditingYearId(id);
    setYear(year); 
    setOpen(true); 
  };

  return (
    <Box className="text-center mt-8">
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
      >
        <i className="fa-solid fa-plus"></i> Add
      </Button>

      {/* Modal for Add/Edit Year */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <form
          onSubmit={handleAddYear}
          className="w-full max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
        >
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg w-full sm:w-96">
            <Typography
              variant="h6"
              className="text-xl mb-4 text-center font-semibold"
            >
              {editingYearId ? "Edit Year" : "Add Year"}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write Year Here..."
              value={year}
              onChange={handleYearChange}
              error={!!error}
              helperText={error}
              className="mb-4"
            />
            <Box className="flex justify-between">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!!error || !year}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                {editingYearId ? "Update" : "Add"}
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      {/* Year List Section */}
      <Box className="mt-8 px-4 sm:px-0">
        <TextField
          className="w-full sm:w-80 border-b-2 border-gray-500 mb-4"
          label="Quick Search"
          variant="standard"
        />
        <Typography className="text-xl font-bold mt-4 mb-6">
          Passing Year
        </Typography>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border-b">Sr.no</th>
                <th className="px-4 py-2 border-b">Years</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {yearList.length > 0 ? (
                yearList.map((item, i) => (
                  <tr key={item._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{i + 1}</td>
                    <td className="px-4 py-2 border-b">{item.year}</td>
                    <td className="px-4 py-2 border-b">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditYear(item._id, item.year)}
                        className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteYear(item._id)}
                        className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Box className="mt-4 text-center">
          <Typography>
            Totals:
            <Input
              className="ml-4 bg-transparent border-b-2 border-gray-500 text-center"
              placeholder="Number of Fields"
              value={yearList.length}
              readOnly
            />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PassingYear;
