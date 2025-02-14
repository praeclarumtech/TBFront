
//ui of passing  year
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Input,
} from "@mui/material";
import { Years } from "./Years";
import { flushSync } from "react-dom";

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

const CodeBlock = ({ code }) => {
  return (
    <Box
      sx={{
        position: "relative",
        p: 2,
        bgcolor: "#f5f5f5",
        borderRadius: "8px",
        mt: 2,
      }}
    >
      <Typography
        component="pre"
        sx={{ fontSize: "14px", whiteSpace: "pre-wrap" }}
      >
        {code}
      </Typography>
    </Box>
  );
};

const Model = () => {
  const [open, setOpen] = useState(false);
  const [AYear, setAYear] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [yearList, setYearList] = useState(
    Years.map((item, index) => ({ id: index + 1, year: item.year }))
  );

  // console.log(Years);

  const handleAddYear = () => {
    if (!AYear.trim()) {
      setError("Year cannot be Empty");
      return;
    }
    if (isNaN(AYear)) {
      setError("Please Enter Valid year");
      return;
    }
    // if (AYear.length !== "4") {
    //   setError("Please Enter Four digit Year");
    //   return;
    // }
    if (!/^\d{0,4}$/.test(AYear)) {
      setError("Please enter a valid 4-digit year");
      return;
    }
    if (AYear && !yearList.some((item) => item.year === parseInt(AYear))) {
      setYearList([
        ...yearList,
        { id: yearList.length + 1, year: parseInt(AYear) },
      ]);
    }

    // console.log("Year Added:", AYear);
    // console.log(yearList);
    setAYear("");
    setError("");
    setOpen(false);
  };

  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  // Filter years based on search input
  const filteredYears = yearList.filter((item) =>
    item.year.toString().includes(search)
  );

  const handleDelete = (idToDelete) => {
    const updatedList = yearList
      .filter((item) => item.id !== idToDelete)
      .map((item, index) => ({ ...item, id: index + 1 })); // Reassign IDs

    setYearList(updatedList);
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
        Add DropDown Items of Passing Year
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        <i className="fa-solid fa-plus"></i> Add
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Passing Year
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write Year Here..."
            value={AYear}
            // maxlength="4"
            onChange={(e) => {
              setAYear(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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
              value={AYear}
              onClick={handleAddYear}
              disabled={!!error}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ mt: 4 }}>
        <TextField
          sx={{ marginRight: "-50%" }}
          id="standard-basic"
          label="Quick Search"
          variant="standard"
          onChange={handleChange}
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
        </Typography>{" "}
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
            {filteredYears.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
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
            ))}
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
            Totals:-{" "}
            <Input
              sx={marginLeft}
              placeholder="Number of Fields"
              value={yearList.length}
            ></Input>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Model;
