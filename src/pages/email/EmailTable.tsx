import { Dropdown } from "react-bootstrap";
import { useState, useMemo, useEffect } from "react";
import { Trash, Filter, ChevronLeft, ChevronRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import { viewAllEmail, deleteEmail } from "../../api/emailApi";
import moment from "moment";

const EmailTable = () => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
    },
    {
      title: "Email",
      dataIndex: "email_to",
      key: "email_to",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  // Update the initial state to explicitly be an empty array
  interface Email {
    _id: string;
    email_to: string;
    subject: string;
    createdAt: string;
  }

  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update the useEffect block
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await viewAllEmail();
        // Ensure we're setting an array
        const emailData = Array.isArray(response.data?.item)
          ? response.data.item
          : [];
        setEmails(emailData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch emails");
        console.error("Error fetching emails:", err);
        setEmails([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 8 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Select");

  const filteredAndSortedEmails = useMemo(() => {
    if (!Array.isArray(emails)) return [];

    const filteredEmails = emails.filter(
      (email) =>
        email?.email_to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email?.createdAt?.includes(searchTerm)
    );

    console.log("Filtered Emails Before Sorting:", filteredEmails);

    const sortedEmails = [...filteredEmails];

    switch (selectedFilter) {
      case "Date":
        sortedEmails.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        break;
      case "ID":
        sortedEmails.sort((a, b) => a._id.localeCompare(b._id));
        break;
      default:
        break;
    }
    return sortedEmails;
  }, [emails, searchTerm, selectedFilter]);

  const resetFilters = () => {
    setSelectedFilter("Select");
    setSearchTerm("");
  };

  // Calculate pagination indexes
  const indexOfLastEmail = currentPage * itemsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - itemsPerPage;
  const currentEmails = filteredAndSortedEmails.slice(
    indexOfFirstEmail,
    indexOfLastEmail
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  //   const handleSearch = (searchTerm: string) => {
  //     // TODO: Implement search functionality
  //     console.log("Searching for:", searchTerm);
  //   };

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

  // Update bulk delete handler
  const handleBulkDelete = async () => {
    try {
      // Delete all selected emails
      await deleteEmail(selectedEmails);

      // Update local state
      setEmails(emails.filter((email) => !selectedEmails.includes(email._id)));
      setSelectedEmails([]);
      setError(null);
    } catch (err) {
      console.error("Error deleting emails:", err);
      setError("Failed to delete selected emails");
    }
  };

  // Add handler for row click
  const handleRowClick = (emailId: string) => {
    if (selectedEmails.includes(emailId)) {
      handleDelete(emailId);
    }
  };
  console.log(emails);

  return (
    <>
      <div className="container mx-auto">
        {/* Filter Section */}
        <div className="flex items-center gap-3 mb-3 ml-6 mt-3 p-3 border rounded bg-white shadow-sm w-fit">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <span className="font-semibold">Filter By</span>
          </div>

          {/* Dropdown - Note: You might want to replace Bootstrap Dropdown with a custom implementation */}
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-primary"
              className="text-gray-900 font-medium border border-blue-500 hover:bg-blue-50"
            >
              {selectedFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedFilter("ID")}>
                ID
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter("Date")}>
                Date
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm border border-red-500 text-red-500 hover:bg-red-50 rounded"
          >
            <i className="fa-solid fa-rotate-left"></i> Reset Filter
          </button>
        </div>

        {/* Compose Button */}
        <button
          onClick={() => navigate("/email/compose")}
          className="absolute right-32 top-24 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <span className="mr-2">+</span>
          Compose
        </button>

        <div className="relative max-w-[1200px] mx-auto pr-[70px] mt-7">
          <div className="bg-white rounded-lg shadow-sm my-4 p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                {selectedEmails.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-3 py-1 text-sm border border-blue-400 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded p-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-4">Loading emails...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEmails.map((email) => (
                    <tr
                      key={email._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(email._id)}
                    >
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(email._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmails([...selectedEmails, email._id]);
                            } else {
                              setSelectedEmails(
                                selectedEmails.filter((id) => id !== email._id)
                              );
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">{email.email_to}</td>
                      <td className="px-6 py-4">{email.subject}</td>
                      <td className="px-6 py-4">
                        {moment(email.createdAt).format("YYYY-MM-DD")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="relative px-4 mx-10 rounded-lg">
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstEmail + 1} -{" "}
              {Math.min(indexOfLastEmail, filteredAndSortedEmails.length)} of{" "}
              {filteredAndSortedEmails.length}
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage >= Math.ceil(emails.length / itemsPerPage)
                }
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailTable;
