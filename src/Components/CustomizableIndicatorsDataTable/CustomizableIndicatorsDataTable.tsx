import { useState, useEffect } from "react";
import Papa from "papaparse";
import Table from "../Table/Table";
import { RSI } from "technicalindicators";

const CoinIcon = () => {
  return (
    <svg
      className="h-6 w-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="text-green-500"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V7.10139C9.40464 7.43925 8.375 8.58587 8.375 10C8.375 11.4141 9.40463 12.5607 11 12.8986V14.789C10.5435 14.595 10.219 14.3039 10.2015 14.2873C9.81056 13.9024 9.18159 13.9042 8.79293 14.2929C8.4024 14.6834 8.40239 15.3166 8.79291 15.7071C9.05517 15.969 9.37099 16.1852 9.69138 16.3682C10.0315 16.5626 10.4745 16.7635 11 16.8851V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V16.8986C14.5954 16.5607 15.625 15.4141 15.625 14C15.625 12.5859 14.5954 11.4393 13 11.1014V9.16492C13.4727 9.339 13.6825 9.58115 13.7085 9.61119C14.0401 10.0402 14.6562 10.1281 15.0944 9.80419C15.5385 9.47592 15.6325 8.84977 15.3042 8.40562C15.3042 8.40562 15.3047 8.40635 15.3035 8.40472C15.2396 8.31864 15.1726 8.24151 15.0527 8.1254C14.9108 7.98796 14.707 7.81664 14.4357 7.64913C14.0715 7.42421 13.5949 7.21225 13 7.0949V7ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

interface CustomizableIndicatorsDataTableProps {
  csvUrl: string;
}

const fetchCsvData = async (url: string): Promise<string[][]> => {
  const response = await fetch(url);
  const reader = response.body?.getReader();
  const result = await reader?.read();
  const decoder = new TextDecoder("utf-8");
  const csv = decoder.decode(result?.value);
  const { data } = Papa.parse(csv);
  return data as string[][];
};

const addMAColumn = (
  tableData: string[][],
  maLength: number,
  valueIndex: number
) => {
  const movingAverages = tableData.map((row, i) => {
    if (i === 0) {
      return [...row, `${maLength} MA`];
    }
    if (i < maLength + 1) {
      return [...row, "---"];
    } else {
      const values = tableData.slice(i - maLength, i);
      const sum = values.reduce(
        (acc, curr) => acc + Number(curr[valueIndex]),
        0
      );
      const ma = sum / maLength;
      return [...row, ma.toFixed(2)];
    }
  });
  return movingAverages;
};

const addRSIColumn = (
  tableData: string[][],
  rsiLength: number,
  valueIndex: number
) => {
  const inputRSI = {
    values: tableData.map((row) => parseFloat(row[valueIndex])),
    period: rsiLength,
  };
  const rsiValues = RSI.calculate(inputRSI);

  const rsis = tableData.map((row, i) => {
    if (i === 0) {
      return [...row, `${rsiLength} RSI`];
    }
    if (i < rsiLength + 1) {
      return [...row, "---"];
    } else {
      const rsi = rsiValues[i - rsiLength - 1];
      const rsiString = rsi !== undefined ? rsi.toFixed(2) : "---";
      return [...row, rsiString];
    }
  });

  return rsis;
};

const CustomizableIndicatorsDataTable = (
  props: CustomizableIndicatorsDataTableProps
) => {
  const [tableData, setTableData] = useState<string[][]>([]);

  useEffect(() => {
    const fetchTableData = async () => {
      const CsvData = await fetchCsvData(props.csvUrl);
      //   TODO trim csv data func here
      let table = CsvData;
      table = addMAColumn(table, 200, 5);
      table = addRSIColumn(table, 14, 5);
      setTableData(table);
    };
    fetchTableData();
  }, [props.csvUrl]);

  const RsiColor = (indicatorValue: number, price: number): string =>
    indicatorValue > 70
      ? "#FFD700"
      : indicatorValue > 50
      ? "#FFF2AA"
      : indicatorValue > 30
      ? "#AAD3AA"
      : "#007C00";

  //TODO: FIX THE LOGIC OF ABOVE MOVING AVRAGE
  const MaColor = (indicatorValue: number, price: number): string =>
    price > indicatorValue ? "#FFD700" : "#007C00";

  // Define the map
  const columnColorMap = new Map<
    number,
    (indicatorValue: number, price: number) => string
  >();
  columnColorMap.set(8, RsiColor);
  columnColorMap.set(7, MaColor);

  return (
    <Table
      tableData={tableData}
      ColumnIcon={[, , , , , <CoinIcon />, , <CoinIcon />, <CoinIcon />]}
      columnColorMap={columnColorMap}
    />
  );
};
export default CustomizableIndicatorsDataTable;
