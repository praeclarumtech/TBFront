

import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Col, Row, Card } from "react-bootstrap";
import { SetStateAction, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PassingYear = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState("");
  interface Year {
    _id: string;
    year: number;
  }

  const [yearList, setYearList] = useState<Year[]>([]);
  const [editingYearId, setEditingYearId] = useState<string | null>(null); // To track which year is being edited
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const viewYearApi = `${BASE_URL}/api/year/listOfYears/`;
  const createYearApi = `${BASE_URL}/api/year`;
  const deleteYearApi = (_id: any) => `${BASE_URL}/api/year/deleteYear/${_id}`;
  const updateYearApi = (_id: string) => `${BASE_URL}/api/year/updateYear/${_id}`;
  // const viewYearById = (_id) => `${BASE_URL}/api/year/getYearById/${_id}`;

  useEffect(() => {
    getYears();
  }, [currentPage]);

  const getYears = async () => {
    try {
      const response = await axios.get(viewYearApi);
      if (response.data.data.item && Array.isArray(response.data.data.item)) {
        setYearList(response.data.data.item);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Error fetching data!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleAddYear = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!year) {
      setError("Year is required");
      toast.error("Year is required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const yearNumber = Number(year);
      if (isNaN(yearNumber) || year.length !== 4) {
        setError("Please enter a valid number");
        toast.error("Please enter a valid number!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (editingYearId) {
        await handleUpdateYear(editingYearId, yearNumber);
      } else {
        await axios.post(createYearApi, { year: yearNumber });
      }

      setYear("");
      setOpen(false);
      setEditingYearId(null);
      getYears();
    } catch (err) {
      console.error("Error adding/updating year:", err);
      toast.error("Error adding/updating year!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteYear = async (_id: any) => {
    if (!_id) {
      console.error("Invalid ID:", _id);
      return;
    }

    try {
      await axios.delete(deleteYearApi(_id));
      getYears();
      toast.success("Year deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting year:", err);
      toast.error("Error deleting year!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleUpdateYear = async (_id: string, newYear: number) => {
    try {
      await axios.put(updateYearApi(_id), { year: newYear });
      getYears();
      toast.success("Year updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error updating year:", err);
      toast.error("Error updating year!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleYearChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setYear(e.target.value);
    setError("");
  };

  const handleEditYear = (id: string, year: string) => {
    setEditingYearId(id);
    setYear(year);
    setOpen(true);
  };

  const marginLeft = { marginLeft: "20px" };
  const handlePaginationChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const paginatedYearList = yearList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <Row className=" m-5">
      <Col xl={12} lg={12} md={12} xs={12}>
        <Card>
          <Card.Body>
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
              <div className="justify-end text-end m-5 ">
                <Button
                  variant="contained"
                  onClick={() => setOpen(true)}
                  className="px-5 !py-2 !bg-blue-600 !hover:bg-primary !outline-none !text-white"
                >
                  <i className=" fa fa-solid fa-plus text-white py-2"> Add</i>
                </Button>
              </div>

              <Modal open={open} onClose={() => setOpen(false)}>
                <form
                  onSubmit={handleAddYear}
                  className="w-full max-w-sm mx-auto mt-10 "
                >
                  <Box className="" sx={modalStyle}>
                    <Typography variant="h6" className="" gutterBottom>
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
                      className=""
                    />
                    <Box
                      className=""
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        className="px-4 py-2 !bg-red-600 !hover:bg-denger
                        !outline-none !text-white"
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="contained"
                        className="px-4 py-1 !bg-blue-600 !hover:bg-primary !outline-none !text-white"
                        color="primary"
                        type="submit"
                        disabled={!!error || !year}
                      >
                        {editingYearId ? "Update" : "Add"}
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Modal>

              <Box className="" sx={{ mt: 4 }}>
                <TextField
                  className=""
                  sx={{ marginRight: "-50%" }}
                  label="Quick Search"
                  variant="standard"
                />
                <Typography
                  className=""
                  sx={{
                    fontSize: "25px",
                    float: "left",
                    marginLeft: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Passing Year
                </Typography>

                <div className="overflow-x-auto">
                  <table
                    className="tbl-container custom-table"
                    style={{
                      marginTop: "20px",
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead className="">
                      <tr>
                        <th className="">Sr.no</th>
                        <th className="">Years</th>
                        <th className="">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {yearList.length > 0 ? (
                        yearList.map((item, i) => ( */}
                      {paginatedYearList.length > 0 ? (
                        paginatedYearList.map((item, i) => (
                          <tr key={item._id} className="">
                            <td className="">{i + 1}</td>
                            <td className="">{item.year}</td>

                            <td className="flex justify-center space-x-2 text-center">
                              <EditIcon
                                color="primary"
                                className="mx-2"
                                onClick={() =>
                                  handleEditYear(item._id, item.year.toString())
                                }
                              >
                                Edit
                              </EditIcon>
                              <DeleteIcon
                                style={{ cursor: "pointer", marginLeft: 8 }}
                                color="error"
                                onClick={() => handleDeleteYear(item._id)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Box
                  className=""
                  sx={{
                    inline: "true",
                    textAlign: "center",
                    mt: 2,
                    position: "bottom",
                  }}
                >
                  {/* <Typography>
                    Totals:
                    <Input
                      className=""
                      placeholder="Number of Fields"
                      value={yearList.data.data.item.totalRecords}
                      sx={marginLeft}
                      readOnly
                    />
                  </Typography> */}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      onClick={() => handlePaginationChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </Button>
                    <Button
                      onClick={() => handlePaginationChange(currentPage + 1)}
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

export default PassingYear;
