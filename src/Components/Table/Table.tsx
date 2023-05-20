import { useState, useRef, useEffect } from "react";
import { MarketSentiment } from "../CustomizableIndicatorsDataTable/CustomizableIndicatorsDataTable";

export interface IndicatorValueWithStyle {
  value: number;
  color: string;
  //Add icon property if needed
  sentiment: MarketSentiment;
}
//TODO indicatorsData should be array each element need to have header as well
interface TableProps {
  tableData: string[][];
  indicatorsData: {
    Ma: IndicatorValueWithStyle[];
    Rsi: IndicatorValueWithStyle[];
  };
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
    <div className="relative w-full overflow-auto rounded-xl">
      <table className="w-full text-center text-sm text-foreground">
        <thead className="sticky top-0 bg-secondary-light text-sm uppercase text-foreground">
          <tr>
            {props.tableData.length > 0 &&
              props.tableData[0].concat(["MA", "RSI"]).map((header: string) => (
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
                    className={`whitespace-nowrap p-4 font-medium text-foreground`}
                  >
                    <div className="flex justify-center gap-x-1">{cell}</div>
                  </td>
                ))}
                {
                  <td
                    className={`whitespace-nowrap p-4 font-medium text-foreground`}
                  >
                    <div
                      className="flex justify-center gap-x-1"
                      style={{
                        color: props.indicatorsData.Ma[i]?.color,
                      }}
                    >
                      {props.indicatorsData.Ma[i]?.value}
                    </div>
                  </td>
                }
                {
                  <td
                    className={`whitespace-nowrap p-4 font-medium text-foreground`}
                  >
                    <div
                      className="flex justify-center gap-x-1"
                      style={{
                        color: props.indicatorsData.Rsi[i]?.color,
                      }}
                    >
                      {props.indicatorsData.Rsi[i]?.value}
                    </div>
                  </td>
                }
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
