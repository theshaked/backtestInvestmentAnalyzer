import { useState, useEffect } from "react";
import Papa from "papaparse";
import Table from "../Table/Table";
import { RSI } from "technicalindicators";

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

const addCounterColumn = (tableData: string[][]) => {
  return tableData.map((row, i) => {
    if (i === 0) {
      return [...row, "Counter"];
    } else {
      return [...row, `${i}`];
    }
  });
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
      table = addCounterColumn(table);
      table = addMAColumn(table, 200, 5);
      table = addRSIColumn(table, 14, 5);
      setTableData(table);
    };
    fetchTableData();
  }, [props.csvUrl]);

  return <Table tableData={tableData} />;
};
export default CustomizableIndicatorsDataTable;
