/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteDuplicateApplicants, downloadApplicant } from "api/applicantApi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AnyObject } from "yup";
import { Badge, Drawer, Space, Table, Button } from "antd";
import DeleteModal from "components/BaseComponents/DeleteModal";
import { Spinner } from "react-bootstrap";
import saveAs from "file-saver";

interface DrawerDataProps {
  duplicateRecords: any[];
  fetchDuplicateData: () => void;
}

const DrawerData = ({
  duplicateRecords,
  fetchDuplicateData,
}: DrawerDataProps) => {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const columns_data = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  const deleteDuplicateData = async () => {
    if (duplicateRecords?.length) {
      const ids = duplicateRecords.map((item: AnyObject) => item._id);
      const payload = { ids };
      setDeleteLoader(true);

      try {
        const res = await deleteDuplicateApplicants(payload);
        if (res?.statusCode === 200 || res?.success === true) {
          toast.success(res.message);
          setDeleteLoader(false);
          setShowDeleteModal(false);
          fetchDuplicateData(); // Refresh from parent
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setDeleteLoader(false);
        setShowDeleteModal(false);
      }
    }
  };

  useEffect(() => {
    fetchDuplicateData();
  }, []);

  const handleDeleteSingle = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDownload = async () => {
    setDownloadLoader(true);

    try {
      const response = await downloadApplicant();

      const text = await response.text();
      let parsed;

      try {
        parsed = JSON.parse(text);
        console.log("parsed", parsed);
      } catch {
        const blob = new Blob([text], { type: "text/csv" });
        saveAs(blob, "Duplicate_Applicants_Data.csv");
        toast.success("File downloaded successfully!");
        return;
      }
    } catch (error) {
      console.error("Download error", error);
      toast.error("Failed to download file");
    } finally {
      setDownloadLoader(false);
    }
  };

  return (
    <>
      <DeleteModal
        show={showDeleteModal}
        onCloseClick={closeDeleteModal}
        onDeleteClick={deleteDuplicateData}
        loader={deleteLoader}
      />
      <div className="ml-1">
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onClick={showDrawer}
        >
          <Badge count={duplicateRecords.length}>
            <i
              className="ri-spam-2-fill"
              style={{ fontSize: "30px", color: "#5340d9" }}
            ></i>
          </Badge>
        </button>
        <Space />
        <Drawer
          title="Duplicate Records"
          placement="right"
          width={700}
          onClose={onClose}
          open={open}
          extra={
            <div className="drawer-actions">
              {downloadLoader ? (
                <Spinner size="sm" className="me-2" />
              ) : (
                <i
                  className="ri-download-2-line download-icon"
                  title="Download"
                  onClick={handleDownload}
                ></i>
              )}

              <Button
                onClick={handleDeleteSingle}
                className="delete-button"
                type="primary"
                danger
              >
                Delete All
              </Button>
            </div>
          }
        >
          <Table dataSource={duplicateRecords} columns={columns_data} />
        </Drawer>
      </div>
    </>
  );
};

export default DrawerData;
