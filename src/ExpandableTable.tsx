import IconButton from "@seaweb/coral/components/IconButton";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@seaweb/coral/components/Table";
import { useState } from "react";
import ChevronDoubleLeft from "@seaweb/coral/icons/ChevronDoubleLeft";
import ChevronDoubleRight from "@seaweb/coral/icons/ChevronDoubleRight";

type ExpandedRange = [number, number];

export default function ExpandableTable<T extends object>({
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
  /** exRange[0] needs to be more than 0
   * exRange is also a pair [x, y], where columns x, x+1, ... y-1 will be expandable.
   */
  exRange: ExpandedRange;
}) {
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

  const cellShouldShowLeftExpandButton = (index: number) => {
    return getLastHiddenIndex() + 1 === index && isRangeValid;
  };
  const cellShouldShowRightExpandButton = (index: number) => {
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
                    <IconButton
                      onClick={toggleExpanded}
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "0",
                        transform: "translateX(-100%)",
                        zIndex: "2",
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDoubleLeft />
                      ) : (
                        <ChevronDoubleRight />
                      )}
                    </IconButton>
                  ) : cellShouldShowRightExpandButton(index) ? (
                    <IconButton
                      onClick={toggleExpanded}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        transform: "translateX(-100%)",
                        zIndex: "2",
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDoubleLeft />
                      ) : (
                        <ChevronDoubleRight />
                      )}
                    </IconButton>
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
