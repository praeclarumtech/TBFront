import "../index.css";

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

const marginLeft = { marginLeft: "20px" };

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

  const viewYearApi = "https://tbapi-jtu7.onrender.com/api/year/listOfYears/";
  const createYearApi = "https://tbapi-jtu7.onrender.com/api/year";
  const deleteYearApi = (_id) =>
    `https://tbapi-jtu7.onrender.com/api/year/deleteYear/${_id}`;
  

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
     // Convert the string year to a number before sending it
     const yearNumber = Number(year);

     if (isNaN(yearNumber)) {
       setError("Please enter a valid number");
       return;
     }

     const response = await axios.post(createYearApi, { year: yearNumber });
     setYear("");
     setOpen(false);
     getYears();
   } catch (err) {
     console.error("Error adding year:", err);
   }
 };

  const handleDeleteYear = async (_id: any) => {
    try {
      await axios.delete(deleteYearApi(_id));
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
      <Button variant="contained" onClick={() => setOpen(true)}>
        <i className="fa-solid fa-plus"></i> Add
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
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
            {yearList.length > 0 ? (
              yearList.map((item, i) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="3">No data available</td>
              </tr>
            )}
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
