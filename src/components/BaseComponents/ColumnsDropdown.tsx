import React, { useState, useEffect } from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { Checkbox } from "antd";
import { ColumnConfig } from "interfaces/global.interface";

interface ColumnsDropdownProps {
  availableColumns: ColumnConfig[];
  onColumnsChange: (visibleColumns: string[]) => void;
  className?: string;
}

const ColumnsDropdown: React.FC<ColumnsDropdownProps> = ({
  availableColumns,
  onColumnsChange,
  className = "",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localColumns, setLocalColumns] = useState<ColumnConfig[]>(
    availableColumns || []
  );

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    if (availableColumns) {
      setLocalColumns(availableColumns);
    }
  }, [availableColumns]);

  const toggleColumnVisibility = (columnId: string) => {
    const updatedColumns = localColumns.map((col) =>
      col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
    );

    setLocalColumns(updatedColumns);

    if (onColumnsChange) {
      const visibleColumns = updatedColumns
        .filter((col) => col.isVisible !== false)
        .map((col) => col.id);
      onColumnsChange(visibleColumns);
    }
  };

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
      className={className}
    >
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
          {localColumns.map((column) => (
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
  );
};

export default ColumnsDropdown;
