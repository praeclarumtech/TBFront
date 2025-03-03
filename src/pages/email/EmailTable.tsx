import { useState, useEffect } from "react";
import { Trash } from "react-feather";
import { useNavigate } from "react-router-dom";
import { viewAllEmail, deleteEmail } from "../../api/emailApi";
import moment from "moment";
import TableContainer from "../../components/BaseComponents/TableContainer";
import BaseInput from "../../components/BaseComponents/BaseInput";
import { InputPlaceHolder } from "../../components/constants/common";

const EmailTable = () => {
  const navigate = useNavigate();

  interface Email {
    _id: string;
    email_to: string;
    subject: string;
    createdAt: string;
  }

  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("Select");
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Define columns for the TableContainer
  const columns = [
    {
      header: "",
      accessorKey: "checkbox",
      enableColumnFilter: false,
      cell: ({ row }: { row: any }) => (
        <input
          type="checkbox"
          checked={selectedEmails.includes(row.original._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedEmails([...selectedEmails, row.original._id]);
            } else {
              setSelectedEmails(selectedEmails.filter((id) => id !== row.original._id));
            }
          }}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      header: "Email",
      accessorKey: "email_to",
      enableColumnFilter: false,
    },
    {
      header: "Subject",
      accessorKey: "subject",
      enableColumnFilter: false,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      enableColumnFilter: false,
      cell: ({ row }: { row: any }) => moment(row.original.createdAt).format("YYYY-MM-DD"),
    },
  ];

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await viewAllEmail();
        const emailData = Array.isArray(response.data?.item) ? response.data.item : [];
        setEmails(emailData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch emails");
        console.error("Error fetching emails:", err);
        setEmails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteEmail([id]);
      setEmails(emails.filter((email) => email._id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting email:", err);
      setError("Failed to delete email");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteEmail(selectedEmails);
      setEmails(emails.filter((email) => !selectedEmails.includes(email._id)));
      setSelectedEmails([]);
      setError(null);
    } catch (err) {
      console.error("Error deleting emails:", err);
      setError("Failed to delete selected emails");
    }
  };

  const resetFilters = () => {
    setSelectedFilter("Select");
  };

  return (
    <div className="container mx-auto">
      {/* Header Section with Filter and Compose Button */}
      <div className="mt-[40px] mb-4">
        <div className="card mb-3">
          <div className="card-body">
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-auto d-flex justify-content-start">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFiltersVisible(!filtersVisible);
                    }}
                    className="btn btn-primary"
                  >
                    {filtersVisible ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>

                <div className="col-auto d-flex justify-content-end gap-2">
                  <button
                    onClick={() => navigate("/email/compose")}
                    className="btn btn-success"
                  >
                    Compose Email
                  </button>
                </div>
              </div>
            </div>

            {filtersVisible && (
              <div className="mt-3 w-100">
                <div className="row g-3">
                  <div className="col-xl-2 col-sm-6 col-md-4 col-lg-2">
                    <label className="form-label">Start Date</label>
                    <BaseInput
                      name="startDate"
                      type="date"
                      placeholder={InputPlaceHolder("Start Date")}
                      passwordToggle={false}
                    />
                  </div>
                  <div className="col-xl-2 col-sm-6 col-md-4 col-lg-2">
                    <label className="form-label">End Date</label>
                    <BaseInput
                      name="endDate"
                      type="date"
                      placeholder={InputPlaceHolder("End Date")}
                      passwordToggle={false}
                    />
                  </div>
                  <div className="col-xl-2 col-sm-6 col-md-6 col-lg-2">
                    <label className="form-label">&nbsp;</label>
                    <button
                      onClick={resetFilters}
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {/* Search Bar and Bulk Delete Button */}
          <div className="flex justify-between items-center mb-4">
            <div>
              {selectedEmails.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-3 py-1 text-sm border border-red-400 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash size={16} />
                </button>
              )}
            </div>
            <div className="w-72">
              <input
                type="text"
                className="form-control"
                placeholder="Search emails..."
                onChange={(e) => {
                  // Your search logic here
                }}
              />
            </div>
          </div>

          {/* Table Section */}
          {loading ? (
            <div className="text-center py-4">Loading emails...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <TableContainer
              columns={columns}
              data={emails}
              isGlobalFilter={false}
              customPageSize={5}
              theadClass="table-light text-muted"
              SearchPlaceholder="Search..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTable;
