/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useEffect, useState } from "react";
import {
  CardBody,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Select, Checkbox } from "antd";

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

import Loader from "./Loader";
import appConstants from "constants/constant";
import { ColumnConfig, TableContainerProps } from "interfaces/global.interface";

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
        className="border rounded shadow w-36"
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
  isNFTRankingFilter,
  isContactsFilter,
  isCompaniesFilter,
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
  availableColumns,
  onColumnsChange,
}: TableContainerProps & {
  availableColumns?: { id: string; header: string; isVisible?: boolean }[];
  onColumnsChange?: (visibleColumns: string[]) => void;
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localAvailableColumns, setLocalAvailableColumns] = useState(
    availableColumns || []
  );

  const { Option } = Select;

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const fuzzyFilter: FilterFn<any> = (row: any, columnId, value, addMeta) => {
    const itemRank = rankItem(row?.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  useEffect(() => {
    if (availableColumns) {
      setLocalAvailableColumns(availableColumns);
    }
  }, [availableColumns]);

  const toggleColumnVisibility = (columnId: string) => {
    const updatedColumns = localAvailableColumns.map((col: ColumnConfig) =>
      col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
    );

    setLocalAvailableColumns(updatedColumns);

    if (onColumnsChange) {
      const visibleColumns = updatedColumns
        .filter((col: ColumnConfig) => col.isVisible !== false)
        .map((col: ColumnConfig) => col.id);
      onColumnsChange(visibleColumns);
    }
  };
  const visibleColumns = React.useMemo(() => {
    return columns.filter((col: any) => {
      const columnDef = col as { id?: string; accessorKey?: string };
      const columnId = columnDef.id || columnDef.accessorKey;
      if (!columnId) return true;

      const columnConfig = localAvailableColumns.find(
        (c: ColumnConfig) => c.id === columnId
      );
      return columnConfig?.isVisible !== false;
    });
  }, [columns, localAvailableColumns]);

  const table = useReactTable({
    columns: visibleColumns,
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
    getState,
  } = table;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Fragment>
      <Row className="mb-3">
        <CardBody className="pt-0 pb-0">
          <form>
            <Row className="align-items-center">
              {isHeaderTitle && (
                <Col lg={7} sm={6}>
                  <h4 className="fw-bold text-dark">{isHeaderTitle}</h4>
                </Col>
              )}

              <Col className="d-flex justify-content-end align-items-center">
                {isGlobalFilter && (
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
                )}

                {availableColumns && (
                  <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle caret className="px-3" color="primary">
                      Columns
                    </DropdownToggle>
                    <DropdownMenu
                      className="p-3 mt-3"
                      style={{
                        minWidth: "250px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      <div className="d-flex flex-column">
                        {localAvailableColumns.map((column) => (
                          <Checkbox
                            key={column.id}
                            checked={column.isVisible !== false}
                            onChange={() => toggleColumnVisibility(column.id)}
                            style={{
                              marginBottom: "8px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {column.header}
                          </Checkbox>
                        ))}
                      </div>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </Col>
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
        <Table hover className={tableClass}>
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
                  <div className="flex items-center justify-center py-4">
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
        <Row className="align-items-center g-3">
          <div className="gap-3 col-sm-6 d-flex align-items-center">
            <div className="text-muted">Total Records: {totalRecords}</div>
          </div>

          <div className="col-sm-6">
            <ul
              className="mb-0 pagination pagination-separated justify-content-end"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                listStyle: "none",
              }}
            >
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
                  className="bg-white border-0 page-link"
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
                          margin: "0 2px",
                          display: "inline-block",
                          fontSize: "14px",
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
                  className="bg-white border-0 page-link"
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
              <Select
                defaultValue={pagination.pageSize}
                onChange={(value) =>
                  setPagination((prev: any) => ({
                    ...prev,
                    pageSize: value,
                    pageIndex: 0,
                  }))
                }
                style={{
                  width: 80,
                }}
                dropdownStyle={{
                  backgroundColor: "#00000",
                  color: "#000",
                }}
              >
                {[20, 100, 200, 500].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
            </ul>
          </div>
        </Row>
      )}
    </Fragment>
  );
};

export default TableContainer;
