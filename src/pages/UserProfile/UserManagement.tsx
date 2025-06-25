/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers, updateUserStatus } from "api/usersApi";
import ActiveModal from "components/BaseComponents/ActiveModal";
import DeleteModal from "components/BaseComponents/DeleteModal";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { AnyObject } from "yup";
import { Badge } from "antd";
import Skeleton from "react-loading-skeleton";
 
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [dataActive, SetDataActive] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
 
  const handleUpdateUserStatus = async (id: string, value: AnyObject) => {
    setIsLoading(true);
    await updateUserStatus(id, value)
      .then((res) => {
        if (res?.success === true && res.statusCode === 202) {
          toast.success(res?.message);
          setShowActiveModal(false);
          setShowDeleteModal(false);
          fetchUsers();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.message);
        setShowActiveModal(false);
        setShowDeleteModal(false);
      })
      .finally(() => {
        setIsLoading(false);
        setShowActiveModal(false);
        setShowDeleteModal(false);
      });
  };
 
  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response?.data?.item || []);
    } catch (error) {
      console.error("Error fetching total applicants:", error);
    }
  };
 
  useEffect(() => {
    fetchUsers();
  }, []);
 
  const closeActiveModal = () => {
    setShowActiveModal(false);
  };
 
  const handleUpdateUserStatusModal = (id: any, isActive: any) => {
    setSelectedRecord(id);
    SetDataActive(!isActive);
    setShowActiveModal(true);
  };
 
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
 
  const handleDeleteUser = (id: string) => {
    setSelectedRecord(id);
    setShowDeleteModal(true);
  };
 
  const handleRowClick = (role: string) => {
    switch (role) {
      case "admin":
        return "purple";
      case "user":
        return "volcano";
      case "vendor":
        return "cyan";
      case "guest":
        return "magenta";
      case "hr":
        return "green";
      default:
        return "default";
    }
  };
 
  return (
    <>
      <ActiveModal
        show={showActiveModal}
        loader={isLoading}
        onYesClick={() =>
          handleUpdateUserStatus(selectedRecord || "", { isActive: dataActive })
        }
        onCloseClick={closeActiveModal}
        flag={!dataActive}
      />
 
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={() =>
          handleUpdateUserStatus(selectedRecord || "", { isDeleted: true })
        }
        loader={isLoading}
      />
      <div className="pt-1 page-content">
        <Container fluid className="p-6">
          <Row className="mt-1 fw-bold text-dark d-flex align-items-center">
            <Col
              sm={12}
              lg={12}
              className="flex-wrap mb-2 ml-3 d-flex justify-content-between align-items-center"
            >
              <div className="text-2xl font-bold">User Management</div>
            </Col>
          </Row>
 
          {users.length === 0 ? (
           <Skeleton count={10} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
              {users.map((user: any) => (
                <Badge.Ribbon text={user?.role} color={handleRowClick(user?.role)}>
                  <div
                    key={user?._id}
                    className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-200"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {user?.userName}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2 break-all">
                      {user?.email}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        user.isActive ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {user.isActive ? "Active" : "Deactive"}
                    </p>
 
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          handleUpdateUserStatusModal(user._id, user.isActive)
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm ${
                          user.isActive
                            ? "bg-gray-600 hover:bg-gray-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        <i
                          className={`ri-${
                            user.isActive ? "close-circle" : "check-line"
                          }`}
                        ></i>
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
 
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
                      >
                        <i className="ri-delete-bin-6-line"></i> Delete
                      </button>
                    </div>
                  </div>
                </Badge.Ribbon>
              ))}
            </div>
          )}
        </Container>
      </div>
    </>
  );
};
 
export default UserManagement;
 
 