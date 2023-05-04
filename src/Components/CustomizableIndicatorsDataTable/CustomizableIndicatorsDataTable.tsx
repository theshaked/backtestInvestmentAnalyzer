import { useState, useEffect } from "react";
import Table from "../Table/Table";
import { RSI } from "technicalindicators";
import { CoinIcon } from "../../Icons/Icons";

interface CustomizableIndicatorsDataTableProps {
  dataTable: string[][];
  maLength: number;
  rsiRange: [number, number];
}

const addColumnWithValues = (
  tableData: string[][],
  values: number[],
  length: number,
  header: string
) => {
  const newTable = tableData.map((row, i) => {
    if (i === 0) {
      return [...row, `${length} ${header}`];
    }
    if (i < length + 1) {
      return [...row, "---"];
    } else {
      const value = values[i - length - 1];
      const valueString = value !== undefined ? value.toFixed(2) : "---";
      return [...row, valueString];
    }
  });

  return newTable;
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
  const newTable = addColumnWithValues(
    tableData,
    RSI.calculate(inputRSI),
    rsiLength,
    "RSI"
  );
  return newTable;
};

const CustomizableIndicatorsDataTable = (
  props: CustomizableIndicatorsDataTableProps
) => {
  const [tableData, setTableData] = useState<string[][]>([]);

  useEffect(() => {
    const fetchTableData = async () => {
      let table = props.dataTable;
      table = addMAColumn(table, props.maLength, 5);
      table = addRSIColumn(table, 14, 5);
      setTableData(table);
    };
    fetchTableData();
  }, [props.dataTable, props.maLength]);

  const RsiColor = (indicatorValue: number, price: number): string =>
    indicatorValue > props.rsiRange[1]
      ? "#FFD700"
      : indicatorValue > (props.rsiRange[0] + props.rsiRange[1]) / 2
      ? "#FFF2AA"
      : indicatorValue > props.rsiRange[0]
      ? "#AAD3AA"
      : "#007C00";

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
      ColumnIcon={[, , , , , , , <CoinIcon />, <CoinIcon />]}
      columnColorMap={columnColorMap}
    />
  );
};
export default CustomizableIndicatorsDataTable;
