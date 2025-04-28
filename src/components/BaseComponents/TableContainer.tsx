/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useEffect, useState } from "react";
import { CardBody, Col, Row, Table } from "reactstrap";
import { Link } from "react-router-dom";

import {
  Column,
  Table as ReactTable,
  ColumnFiltersState,
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";

import // ProductsGlobalFilter,
// CustomersGlobalFilter,
// OrderGlobalFilter,
// ContactsGlobalFilter,
// CompaniesGlobalFilter,
// LeadsGlobalFilter,
// CryptoOrdersGlobalFilter,
// InvoiceListGlobalSearch,
// TicketsListGlobalFilter,
// NFTRankingGlobalFilter,
// TaskListGlobalFilter,
"./GlobalSearchFilter";
import Loader from "./Loader";
import appConstants from "constants/constant";
import { TableContainerProps } from "interfaces/global.interface";

const { handleResponse } = appConstants;
// Column Filter
const Filter = ({
  column,
}: {
  column: Column<any, unknown>;
  table: ReactTable<any>;
}) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      id="search-bar-0"
      className="form-control search"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const TableContainer = ({
  isPagination = true,
  columns,
  data,
  isGlobalFilter,
  isProductsFilter,
  // isCustomerFilter,
  // isOrderFilter,
  // isLeadsFilter,
  // isCryptoOrdersFilter,
  // isInvoiceListFilter,
  // isTicketsListFilter,
  isNFTRankingFilter,
  // isTaskListFilter,
  isContactsFilter,
  isCompaniesFilter,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  isHeaderTitle,
  totalRecords,
  pagination,
  setPagination,
  loader,
  customPadding,
}: TableContainerProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const fuzzyFilter: FilterFn<any> = (row: any, columnId, value, addMeta) => {
    const itemRank = rankItem(row?.getValue(columnId), value);

    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    manualPagination: true,
    pageCount: Math.ceil(totalRecords / pagination?.pageSize),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    setPageSize,
    getState,
  } = table;

  useEffect(() => {
    if (Number(customPageSize)) {
      setPageSize(Number(customPageSize));
    }
  }, [customPageSize, setPageSize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Fragment>
      <Row className="mb-3">
        <CardBody className="pb-0 pt-0">
          <form>
            <Row className="d-flex justify-content-between">
              {isHeaderTitle && (
                <Col lg={7} sm={3}>
                  <h4 className="fw-bold text-dark">{isHeaderTitle}</h4>
                </Col>
              )}
              {isGlobalFilter && (
                <Col sm={3}>
                  <div
                    className={
                      isProductsFilter ||
                      isContactsFilter ||
                      isCompaniesFilter ||
                      isNFTRankingFilter
                        ? "search-box me-2 mb-2 d-inline-block"
                        : "search-box me-2 mb-2 d-inline-block col-12"
                    }
                  >
                    <DebouncedInput
                      value={globalFilter ?? ""}
                      onChange={(value) => setGlobalFilter(String(value))}
                      placeholder={SearchPlaceholder}
                      onKeyDown={handleKeyDown}
                    />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>
                </Col>
              )}
              {/* {isProductsFilter && <ProductsGlobalFilter />}
                {isCustomerFilter && <CustomersGlobalFilter />}
                {isOrderFilter && <OrderGlobalFilter />}
                {isContactsFilter && <ContactsGlobalFilter />}
                {isCompaniesFilter && <CompaniesGlobalFilter />}
                {isLeadsFilter && <LeadsGlobalFilter />}
                {isCryptoOrdersFilter && <CryptoOrdersGlobalFilter />}
                {isInvoiceListFilter && <InvoiceListGlobalSearch />}
                {isTicketsListFilter && <TicketsListGlobalFilter />}
                {isNFTRankingFilter && <NFTRankingGlobalFilter />}
                {isTaskListFilter && <TaskListGlobalFilter />} */}
            </Row>
          </form>
        </CardBody>
      </Row>

      <div
        className={`h-[400px] overflow-auto ${divClass}`}
        style={{
          maxHeight: "400px",
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
        <Table
          hover
          className={tableClass}
          // style={{ height: "50%", minWidth: "100%" }}
        >
          <thead
            className={`${theadClass} sticky-top`}
            style={{
              backgroundColor: "#fff",
              position: "sticky",
              top: "0",
              zIndex: 1,
            }}
          >
            {getHeaderGroups()?.map((headerGroup: any) => (
              <tr className={trClass} key={headerGroup.id}>
                {headerGroup?.headers?.map((header: any) => (
                  <th
                    key={header.id}
                    className={thClass}
                    {...{
                      onClick: header?.column?.getToggleSortingHandler(),
                    }}
                  >
                    {header?.isPlaceholder ? null : (
                      <React.Fragment>
                        {flexRender(
                          header?.column?.columnDef?.header,
                          header?.getContext()
                        )}
                        {/* {{
                          asc: " ",
                          desc: " ",
                        }[header?.column?.getIsSorted() as string] ?? null}
                        {header?.column?.getCanFilter() ? (
                          <div>
                            <Filter column={header?.column} table={table} />
                          </div>
                        ) : null} */}
                        {header?.column?.getIsSorted() ? (
                          <span>
                            {header?.column?.getIsSorted() === "asc"
                              ? " ↑"
                              : " ↓"}
                          </span>
                        ) : null}
                        {header?.column?.getCanFilter() ? (
                          <div>
                            <Filter column={header?.column} table={table} />
                          </div>
                        ) : null}
                      </React.Fragment>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {loader ? (
              <tr>
                <td
                  colSpan={getHeaderGroups()[0]?.headers?.length}
                  className="text-center"
                >
                  <div className="flex justify-center items-center py-4">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : getRowModel()?.rows?.length ? (
              getRowModel()?.rows?.map((row: any) => {
                return (
                  <tr key={row.id}>
                    {row?.getVisibleCells()?.map((cell: any) => {
                      return (
                        <td
                          key={cell.id}
                          style={{ padding: customPadding || "0.75rem 1.5rem" }}
                        >
                          {flexRender(
                            cell?.column?.columnDef?.cell,
                            cell?.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={getHeaderGroups()[0]?.headers?.length}
                  className="text-center"
                >
                  {handleResponse?.dataNotFound}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {isPagination && (
        // <Row className="align-items-center mt-2 g-3">
        //   <div className="col-sm-6">
        //     <div className="text-muted">Total Records: {totalRecords}</div>
        //   </div>
        //   <div className="col-sm-6">
        //     <ul className="pagination pagination-separated justify-content-end mb-0">
        //       <li
        //         className={
        //           !getCanPreviousPage() ? "page-item disabled" : "page-item"
        //         }
        //       >
        //         <Link
        //           to="#"
        //           className="page-link"
        //           onClick={() =>
        //             setPagination((prev: { pageIndex: number }) => ({
        //               ...prev,
        //               pageIndex: prev.pageIndex - 1,
        //             }))
        //           }
        //         >
        //           <i className="ri-arrow-left-s-line" />
        //         </Link>
        //       </li>

        //       {getPageOptions().map((item: number) => {
        //         // Show first page, current page ±1, and last page
        //         const currentPage = getState().pagination.pageIndex;
        //         const isFirstPage = item === 0;
        //         const isLastPage = item === getPageOptions().length - 1;
        //         const isCurrentPageArea = Math.abs(item - currentPage) <= 1;

        //         if (isFirstPage || isLastPage || isCurrentPageArea) {
        //           return (
        //             <li
        //               key={item}
        //               className={`page-item ${
        //                 currentPage === item ? "active" : ""
        //               }`}
        //             >
        //               <Link
        //                 to="#"
        //                 className="page-link"
        //                 onClick={() => setPageIndex(item)}
        //               >
        //                 {item + 1}
        //               </Link>
        //             </li>
        //           );
        //         } else if (
        //           (item === currentPage - 2 && currentPage > 2) ||
        //           (item === currentPage + 2 &&
        //             currentPage < getPageOptions().length - 3)
        //         ) {
        //           return (
        //             <li key={item} className="page-item disabled">
        //               <Link to="#" className="page-link">
        //                 ...
        //               </Link>
        //             </li>
        //           );
        //         }
        //         return null;
        //       })}

        //       <li
        //         className={
        //           !getCanNextPage() ? "page-item disabled" : "page-item"
        //         }
        //       >
        //         <Link
        //           to="#"
        //           className="page-link"
        //           onClick={() =>
        //             setPagination((prev: { pageIndex: number }) => ({
        //               ...prev,
        //               pageIndex: prev.pageIndex + 1,
        //             }))
        //           }
        //         >
        //           <i className="ri-arrow-right-s-line" />
        //         </Link>
        //       </li>
        //     </ul>
        //   </div>
        // </Row>

        <Row className="align-items-center mt-2 g-3">
          <div className="col-sm-6">
            <div className="text-muted">Total Records: {totalRecords}</div>
          </div>
          <div className="col-sm-6">
            <ul
              className="pagination pagination-separated justify-content-end mb-0"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                listStyle: "none",
              }}
            >
              {/* Previous Arrow */}
              <li
                className={`page-item ${
                  !getCanPreviousPage() ? "disabled" : ""
                }`}
                style={{
                  opacity: !getCanPreviousPage() ? 0.3 : 1,
                  cursor: !getCanPreviousPage() ? "not-allowed" : "pointer",
                  fontSize: "18px",
                }}
              >
                <Link
                  to="#"
                  className="page-link border-0 bg-white"
                  onClick={() =>
                    setPagination((prev: { pageIndex: number }) => ({
                      ...prev,
                      pageIndex: prev.pageIndex - 1,
                    }))
                  }
                  style={{
                    textDecoration: "none",
                    color: "#666",
                    fontSize: "20px",
                    transition: "color 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#007bff")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#666")
                  }
                >
                  <i className="ri-arrow-left-s-line" />
                </Link>
              </li>

              {/* Page Numbers */}
              {getPageOptions().map((item) => {
                const currentPage = getState().pagination.pageIndex;
                const isFirstPage = item === 0;
                const isLastPage = item === getPageOptions().length - 1;
                const isCurrentPageArea = Math.abs(item - currentPage) <= 1;
                if (isFirstPage || isLastPage || isCurrentPageArea) {
                  return (
                    <li key={item}>
                      <Link
                        to="#"
                        className="page-link"
                        onClick={() => setPageIndex(item)}
                        style={{
                          // padding: "4px 10px",
                          margin: "0 2px",
                          display: "inline-block",
                          fontSize: "14px",
                          // fontWeight: "500",
                          transition: "all 0.2s ease-in-out",
                          textDecoration: "none",
                          color: currentPage === item ? "#fff" : "#666",
                          backgroundColor:
                            currentPage === item ? "#006bff" : "transparent",
                          borderRadius: "50%",
                          border: "0px",
                          fontWeight: currentPage === item ? "bold" : "normal",
                          boxShadow:
                            currentPage === item
                              ? "0px 2px 6px rgba(0, 123, 255, 0.5)"
                              : "none",
                          padding:
                            currentPage === item ? "6px 12px" : "4px 10px",
                        }}
                      >
                        {item + 1}
                      </Link>
                    </li>
                  );
                } else if (
                  (item === currentPage - 2 && currentPage > 2) ||
                  (item === currentPage + 2 &&
                    currentPage < getPageOptions().length - 3)
                ) {
                  return (
                    <li key={item} className="page-item disabled">
                      <span style={{ color: "#999", fontSize: "16px" }}>
                        ...
                      </span>
                    </li>
                  );
                }
                return null;
              })}

              {/* Next Arrow */}
              <li
                className={`page-item ${!getCanNextPage() ? "disabled" : ""}`}
                style={{
                  opacity: !getCanNextPage() ? 0.3 : 1,
                  cursor: !getCanNextPage() ? "not-allowed" : "pointer",
                  fontSize: "18px",
                }}
              >
                <Link
                  to="#"
                  className="page-link border-0 bg-white"
                  onClick={() =>
                    setPagination((prev: { pageIndex: number }) => ({
                      ...prev,
                      pageIndex: prev.pageIndex + 1,
                    }))
                  }
                  style={{
                    textDecoration: "none",
                    color: "#666",
                    fontSize: "20px",
                    transition: "color 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#007bff")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#666")
                  }
                >
                  <i className="ri-arrow-right-s-line" />
                </Link>
              </li>
            </ul>
          </div>
        </Row>
      )}
    </Fragment>
  );
};

export default TableContainer;
