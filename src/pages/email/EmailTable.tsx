import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { viewAllEmail, deleteEmail } from "../../api/emailApi";
import moment from "moment";
import TableContainer from "../../components/BaseComponents/TableContainer";
import BaseInput from "../../components/BaseComponents/BaseInput";
import { InputPlaceHolder } from "../../components/constants/common";
import Loader from "components/BaseComponents/Loader";
import BaseButton from "components/BaseComponents/BaseButton";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { errorHandle } from "components/helpers/service";

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
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = [
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
      cell: ({ row }: { row: any }) =>
        moment(row.original.createdAt).format("YYYY-MM-DD"),
    },
    {
      header: "Action",
      cell: (cell: { row: { original: any } }) => (
        <div className="hstack gap-2">
          <BaseButton
            color="danger"
            id={`delete-${cell?.row?.original?._id}`}
            className="btn btn-sm btn-soft-danger bg-danger"
            onClick={() => handleDelete(cell?.row?.original?._id)}
          >
            <i className="ri-delete-bin-fill align-bottom" />
            <ReactTooltip
              place="bottom"
              variant="error"
              content="Delete"
              anchorId={`delete-${cell?.row?.original?._id}`}
            />
          </BaseButton>
        </div>
      ),
    },
  ];

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const params: {
        page: number;
        pageSize: number;
        startDate?: string;
        endDate?: string;
      } = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
      const response = await viewAllEmail(params);
      const emailData = Array.isArray(response.data?.item)
        ? response.data.item
        : [];
      setEmails(emailData);
      setTotalRecords(response.data?.totalRecords || 0);
    } catch (error) {
      errorHandle(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [pagination.pageIndex, pagination.pageSize, startDate, endDate]);

  const handleDelete = async (id: string) => {
    try {
      await deleteEmail([id]);
      fetchEmails();
    } catch (error) {
      errorHandle(error);
    }
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    fetchEmails();
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
                    <BaseInput
                      label="Start Date"
                      name="startDate"
                      type="date"
                      placeholder={InputPlaceHolder("Start Date")}
                      handleChange={(e: {
                        target: { value: SetStateAction<string> };
                      }) => setStartDate(e.target.value)}
                      value={startDate || ""}
                    />
                  </div>
                  <div className="col-xl-2 col-sm-6 col-md-4 col-lg-2">
                    <BaseInput
                      label="End Date"
                      name="endDate"
                      type="date"
                      placeholder={InputPlaceHolder("End Date")}
                      handleChange={(e: {
                        target: { value: SetStateAction<string> };
                      }) => setEndDate(e.target.value)}
                      value={endDate || ""}
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
          {/* Table Section */}
          {loading ? (
            <div className="text-center py-4">
              <Loader />
            </div>
          ) : (
            <TableContainer
              isHeaderTitle="Emails"
              columns={columns}
              data={emails}
              isGlobalFilter
              customPageSize={10}
              theadClass="table-light text-muted"
              tableClass="!text-nowrap !mb-0 !responsive !table-responsive-sm !table-hover !table-outline-none !mb-0"
              SearchPlaceholder="Search..."
              totalRecords={totalRecords}
              pagination={pagination}
              setPagination={setPagination}
              loader={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTable;
