import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@seaweb/coral/components/Table";
import { CSSProperties, HTMLAttributes, useState } from "react";
import ExpandedHeaderIcon from "./ExpandedHeaderIcon";

type ExpandedRange = [number, number];

interface ExpandButtonProps extends HTMLAttributes<HTMLDivElement> {
  toggleExpanded: () => void;
  isExpanded: boolean;
  additionalStyles?: CSSProperties;
}
const ExpandButton = ({
  toggleExpanded,
  isExpanded,
  additionalStyles,
  ...props
}: ExpandButtonProps) => {
  return (
    <div
      {...props}
      onClick={toggleExpanded}
      style={{
        height: "100%",
        position: "absolute",
        top: "0",
        transform: `translateX(-100%) rotate(${isExpanded ? 180 : 0}deg)`,
        zIndex: "2",
        cursor: "pointer",
        ...additionalStyles,
      }}
    >
      <ExpandedHeaderIcon />
    </div>
  );
};

function ExpandableTable<T extends object>({
  records,
  keyOrder,
  columns,
  exRange = [1, 2],
}: {
  records: T[];
  /**
   * The order of each row's values, it is the developer's responsibility to ensure that this is aligned to the order of {columns}
   */
  keyOrder: (keyof T)[];
  /**
   * The order of columns, with their respective labels and widths
   */
  columns: { label: string; width: number }[];
  /**
   * @description exRange is also a pair [x, y], where columns x, x+1, ... y-1 will be expandable.
   * exRange[0] needs to be more than 0.
   */
  exRange: ExpandedRange;
}) {
  if (columns.length !== keyOrder.length) {
    throw new Error("The length of columns and keyOrder must be the same.");
  } else if (exRange[0] <= 0) {
    throw new Error(
      "Start index of expandable range needs to be greater than 0."
    );
  }

  // * Order the keys
  const valKeys = Object.keys(records[0]);
  const orderedValKeys: (keyof T)[] = keyOrder.filter((key) =>
    valKeys.includes(key.toString())
  );

  // * State handling for expandable range
  const expandedRange: ExpandedRange = exRange;
  // ! perhaps isRangeValid could be used to warn users of this component that it's errorneous?
  const isRangeValid = expandedRange[1] > expandedRange[0];

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // * Utility functions that handle expandable range logic
  /**
   * e.g. [ 0, <1, 2>, 3 ], exRange = <1, 3>
   *  returns 3
   */
  const getLastHiddenIndex = () => {
    if (!expandedRange) return -1;

    return expandedRange[1] - 1;
  };

  // Should show Expand Button outside the cell's left border
  const cellShouldShowLeftExpandButton = (index: number) => {
    return getLastHiddenIndex() + 1 === index && isRangeValid;
  };

  // Should show Expand Button right aligned to the cell's inner right border.
  const cellShouldShowRightExpandButton = (index: number) => {
    if (!isRangeValid) return false;
    return (
      // e.g. [ 0, <1, 2, 3> ] where <1, 4> is expandedRange
      // when collapsed, the expand button should be right-aligned to the first element, marked by "*", i.e. [ 0*]
      (!isExpanded &&
        index + 1 === expandedRange[0] &&
        expandedRange[1] === columns.length) ||
      // e.g. [ 0, <1, 2, 3> ] where <..> is expandedRange
      // when expanded, the expand button should be right-aligned to the last element, marked by "*", i.e. [ 0, 1, 2, 3*]
      (isExpanded && index === columns.length - 1)
    );
  };

  const isColumnVisible = (index: number) => {
    if (isExpanded) return true;
    const [start, end] = expandedRange;
    return index < start || index >= end;
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col, index) =>
              isColumnVisible(index) ? (
                <TableCell
                  key={index}
                  width={col.width}
                  style={{ position: "relative" }}
                >
                  {cellShouldShowLeftExpandButton(index) ? (
                    <ExpandButton
                      toggleExpanded={toggleExpanded}
                      isExpanded={isExpanded}
                      additionalStyles={{
                        left: "0",
                      }}
                    />
                  ) : cellShouldShowRightExpandButton(index) ? (
                    <ExpandButton
                      toggleExpanded={toggleExpanded}
                      isExpanded={isExpanded}
                      additionalStyles={{
                        right: "0",
                      }}
                    />
                  ) : null}
                  {col.label}
                </TableCell>
              ) : null
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((rec, index) => (
            <TableRow key={index}>
              {columns.map(
                (_, index) =>
                  isColumnVisible(index) && (
                    <TableCell>
                      {rec[orderedValKeys[index]] as string}
                    </TableCell>
                  )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpandableTable;
