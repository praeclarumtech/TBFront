// //ui of passing  year
// import React, { useEffect, useState } from "react";
// // import './index.css';

// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   TextField,
//   Input,
// } from "@mui/material";
// import axios from "axios";

// const marginLeft = {
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

// const Model = () => {
//   const [open, setOpen] = useState(false);
//   const viewYearApi = `http://localhost:3000/api/listOfYears`;
//   const createUserApi = "http://localhost:3000/api/year;
//   const [error, setError] = useState(null);
//   // const [isLoading, setIsLoading] = useState(false);

//   const [year, setYear] = useState([]);
//   // const [isLoading, setIsLoading] = useState(false);

//   //api call for table data

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //   //   try {
//   //   //     const response = await fetch(viewYearApi);
//   //   //     if (!response.ok) {
//   //   //       throw new Error("HTTP error!");
//   //   //     }
//   //   //     const data = await response.json();
//   //   //     console.log("Data fetched successfully!", data);
//   //   //   } catch (error) {
//   //   //     console.error("Error fetching data:", error);
//   //   //   }
//   //   // };
//   //   fetchData();
//   // }, []);

//   useEffect(() => {
//     getUsers();
//   }, []);

//   const getUsers = () => {
//     axios
//       .get(viewYearApi)
//       .then((res) => {
//         setYear(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//    const handelInput = (event) => {
//      event.preventDefault();
//      const { year, value } = event.target;
//      console.log(year, value);
//      setYear({ ...year, [year]: value });
//    };

//    const handelSubmit = async (event) => {
//      event.preventDefault();
//      console.log(year);
//      try {
//        setIsLoading(true);
//        const response = await fetch(createUserApi, {
//          method: "POST",
//          headers: {
//            "Content-Type": "application/json",
//          },
//          body: JSON.stringify(year),
//        });

//        if (response.ok) {
//          console.log("Form submitted successfully!");
//          setYear({ year: "" });

//        } else {
//          console.error("Form submission failed!");
//        }
//      } catch (error) {
//        setError(error.message);
//      } finally {
//        setIsLoading(false);
//      }

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
//         Add DropDown Items of Passing Year
//       </Typography>

//       <Button variant="contained" onClick={() => setOpen(true)}>
//         <i className="fa-solid fa-plus"></i> Add
//       </Button>

//       <Modal open={open} onClose={() => setOpen(false)}>
//         {error && <p>Error: {error}</p>}

//         <form onSubmit={handelSubmit}>
//           <Box sx={modalStyle}>
//             <Typography variant="h6" gutterBottom>
//               Passing Year
//             </Typography>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Write Year Here..."
//               value={year}
//               onclick={() => handelInput()}
//               // maxlength="4"
//               onChange={(e) => {
//                 setYear(e.target.value);
//                 setError("");
//               }}
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
//                 value={year}
//                 onClick={handleAddYear}
//                 disabled={!!error}
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
//             {year?.map((item, i) => {
//               return (
//                 <tr key={i + 1}>
//                   <td>{i + 1}</td>
//                   <td>{item.year}</td>
//                   <td>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={() => handleDelete(item._id)}
//                     >
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               );
//             })}
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

// export default Model;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Input,
} from "@mui/material";
import axios from "axios";

const marginLeft = {
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

const Model = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState("");
  const [yearList, setYearList] = useState([]);

  const viewYearApi = `http://localhost:3000/api/listOfYears`;
  const createYearApi = `http://localhost:3000/api/year`;
  const deleteYearApi = (_id) => `http://localhost:3000/api/year/${_id}`;

 
  useEffect(() => {
    getYears();
  }, []);

  
  const getYears = async (response: unknown) => {
    try {
      const response = await axios.get(viewYearApi);
      setYearList(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleAddYear = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!year) {
      setError("");
      return;
    }

    try {
      const response = await axios.post(createYearApi, { year });
      setYear(""); 
      setOpen(false); 
      getYears(response); 
    } catch (err) {
      console.error("Error adding year:", err);
    }
  };

 
  const handleDeleteYear = async (id) => {
    try {
      await axios.delete(deleteYearApi(id));
      getYears(); 
    } catch (err) {
      console.error("Error deleting year:", err);
    }
  };

  
  const handleYearChange = (e) => {
    setYear(e.target.value);
    setError("");
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography
        sx={{
          fontSize: "25px",
          float: "left",
          marginLeft: "20px",
          fontWeight: "bold",
        }}
      >
      
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        <i className="fa-solid fa-plus"></i> Add
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        {error && <p>Error: {error}</p>}

        <form onSubmit={handleAddYear}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Passing Year
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write Year Here..."
              value={year}
              onChange={handleYearChange}
              error={!!error}
              helperText={error}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!!error || !year}
              >
                Add
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      <Box sx={{ mt: 4 }}>
        <TextField
          sx={{ marginRight: "-50%" }}
          id="standard-basic"
          label="Quick Search"
          variant="standard"
         
        />
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
              <th>Years</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {yearList?.map((item, i) => {
              return (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.year}</td>
                  <td>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteYear(item._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Box
          sx={{
            inline: "true",
            textAlign: "center",
            mt: 2,
            position: "bottom",
          }}
        >
          <Typography>
            Totals:{" "}
            <Input
              sx={marginLeft}
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

export default Model;
