

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
// const viewSkillById = (_id) => `${BASE_URL}/api/skill/viewById`;

const AddSkill = () => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState("");
  const [search, setSearch] = useState("");
  const [skillList, setSkillList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingSkill, setEditingSkill] = useState<{ _id: string; skills: string } | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSkills: 0,
  });

  useEffect(() => {
    fetchSkills();
  }, [search, pagination.currentPage]);

  const fetchSkills = () => {
    setIsLoading(true);
    const { currentPage } = pagination;
    axios
      .get(viewSkillApi, {
        params: {
          page: currentPage,
          limit: 10, // You can adjust the limit here
          searchQuery: search,
        },
      })
      .then((res) => {
        if (res.data && Array.isArray(res.data.data)) {
          setSkillList(res.data.data);
          setPagination((prevState) => ({
            ...prevState,
            totalPages: res.data.totalPages,
            totalSkills: res.data.totalSkills,
          }));
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
            toast.success("Skill added successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            fetchSkills();
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
          fetchSkills();
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

  const handleDeleteSkill = (_id: any) => {
    setIsLoading(true);
    axios
      .delete(`${BASE_URL}/api/skill/delete/${_id}`)
      .then(() => {
        setSkillList(skillList.filter((item) => item._id !== _id));
        toast.success("Skill deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchSkills();
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

  const handleSearchChange = (e: { target: { value: string; }; }) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
  };

  const highlightText = (text: string) => {
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

  function openEditModal(item: any): void {
    throw new Error("Function not implemented.");
  }

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
                      className="!quick-search"
                    />
                  </div>
                  <Typography
                    className="justify-start text-left"
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
                        {skillList.map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{highlightText(item.skills)}</td>
                            <td className="flex justify-center space-x-2 text-center">
                              <EditIcon
                                style={{ cursor: "pointer" }}
                                color="primary"
                                onClick={() => openEditModal(item)}
                                className="mx-2"
                              >
                                Edit
                              </EditIcon>
                              <DeleteIcon
                                color="error"
                                style={{ cursor: "pointer", marginLeft: 8 }}
                                onClick={() => handleDeleteSkill(item._id)}
                              />
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
                      value={pagination.totalSkills}
                      readOnly
                      className="inp-tlt"
                    />
                  </Typography>

                  {/* Pagination Controls */}
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <Button
                      disabled={pagination.currentPage === 1}
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                    >
                      Previous
                    </Button>
                    <Typography sx={{ margin: "0 20px" }}>
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </Typography>
                    <Button
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                    >
                      Next
                    </Button>
                  </Box>
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
