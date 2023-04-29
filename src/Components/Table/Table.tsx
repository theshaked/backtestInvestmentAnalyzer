import { Console } from "console";
import { useState, useRef, useEffect, ReactNode } from "react";

interface TableProps {
  tableData: string[][];
  ColumnIcon?: ReactNode[];
  columnColorMap: Map<
    number,
    (indicatorValue: number, price: number) => string
  >;
}

const Table = (props: TableProps) => {
  const [rowsToShow, setRowsToShow] = useState(200);
  const dummyRowRef = useRef<HTMLTableRowElement>(null);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setRowsToShow((prevRows) => prevRows + 200);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    if (dummyRowRef.current) {
      observer.observe(dummyRowRef.current);
    }
    return () => {
      if (dummyRowRef.current) {
        observer.unobserve(dummyRowRef.current);
      }
    };
  }, []);

  return (
    <div className="relative m-10 w-auto overflow-x-auto rounded-lg">
      <table className="w-full text-center text-sm text-foreground">
        <thead className="sticky top-0 bg-secondary-light text-sm uppercase text-foreground">
          <tr>
            {props.tableData.length > 0 &&
              props.tableData[0].map((header: string) => (
                <th key={header} scope="col" className="px-6 py-3">
                  {header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {props.tableData
            .slice(1, rowsToShow)
            .map((row: string[], i: number) => (
              <tr
                key={`row-${i}`}
                className={`border-b border-secondary-light  ${
                  i % 2 !== 0 ? "bg-secondary" : "bg-secondary-dark"
                }`}
              >
                {row.map((cell: string, j: number) => (
                  <td
                    key={`cell-${j}`}
                    className={`whitespace-nowrap px-6 py-4 font-medium text-foreground ${
                      j === 0 ? "text-base font-bold" : ""
                    } `}
                  >
                    <div
                      style={
                        !isNaN(parseInt(cell))
                          ? {
                              color: props.columnColorMap.get(j)?.(
                                parseFloat(cell),
                                parseFloat(props.tableData[i + 1][5])
                              ),
                            }
                          : { color: "black" }
                      }
                      className="flex gap-x-1"
                    >
                      {cell}
                      {props.ColumnIcon && props.ColumnIcon[j]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          <tr ref={dummyRowRef}>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
