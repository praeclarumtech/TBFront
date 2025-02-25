import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Input,
} from "@mui/material";

// import { Persons } from "./Name";
import "./index.css"

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


const ModelAddSkill = () => {
  const [open, setOpen] = useState(false);
  const [skill, setSkill] = useState("");
  const [search, setSearch] = useState("");
  const [skillList, setSkillList] = useState(
    Persons.map((item, index) => ({ id: index + 1, name: item.name }))
  );

  const listOfYearsApi = "https://tbapi-jtu7.onrender.com/listOfYears";

  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handelDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(listOfYearsApi.concat("/") + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setUser(user.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  const getSkills = () => {
    axios
      .get(listOfYearsApi)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddSkill = () => {
    if (
      skill &&
      !skillList.some((item) => item.name.toLowerCase() === skill.toLowerCase())
    ) {
      setSkillList([...skillList, { id: skillList.length + 1, name: skill }]);
    }
    setSkill("");
    setOpen(false);
  };

  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    setOpen(false);
  };

  const filterSkills = skillList.filter((item) =>
    item.name.toLowerCase().includes(search)
  );

  const handleDelete = (idToDelete) => {
    const updatedList = skillList
      .filter((item) => item.id !== idToDelete)
      .map((item, index) => ({ ...item, id: index + 1 })); // Reassign IDs

    setSkillList(updatedList);
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
        Add DropDown Items of Skill
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        <i className="fa-solid fa-plus"></i> Add
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Skill Name
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write down skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSkill}
            >
              Add
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

      <Box sx={{ mt: 4 }}>
        <TextField
          sx={{ marginRight: "-50%" }}
          id="standard-basic"
          label="Quick Search"
          variant="standard"
          onChange={handleChange}
          onClose={() => setOpen(false)}
        />
        <Typography
          sx={{
            fontSize: "25px",
            float: "left",
            marginLeft: "20px",
            fontWeight: "bold",
          }}
        >
          Skills
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
              <th>Skill</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterSkills.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
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
      </Box>
      <Box
        sx={{
          inline: "true",
          textAlign: "center",
          mt: 2,
          position: "bottom",
        }}
      >
        <Typography>
          Totals:-
          <Input
            sx={marginLeft}
            placeholder="Number of Fields"
            value={skillList.length}
            readOnly
          />
        </Typography>
      </Box>
    </Box>
  );
};

export default ModelAddSkill;
