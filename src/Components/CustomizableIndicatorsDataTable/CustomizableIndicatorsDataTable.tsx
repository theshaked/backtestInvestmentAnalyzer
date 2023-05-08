import { useState, useEffect } from "react";
import Table from "../Table/Table";
import { RSI } from "technicalindicators";
import { CoinIcon } from "../../Icons/Icons";

interface CustomizableIndicatorsDataTableProps {
  dataTable: string[][];
  maLength: number;
  rsiRange: [number, number];
}

const PRICE_INDEX = 5;
const RSI_DAYS = 14;
const ICONS = [, , , , , , , <CoinIcon />, <CoinIcon />];

const addCustomColumn = (
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
  priceIndex: number
) => {
  const newTable = tableData.map((row, i) => {
    if (i === 0) {
      return [...row, `${maLength} MA`];
    }
    if (i < maLength + 1) {
      return [...row, "---"];
    } else {
      const values = tableData.slice(i - maLength, i);
      const sum = values.reduce(
        (acc, curr) => acc + Number(curr[priceIndex]),
        0
      );
      const ma = sum / maLength;
      return [...row, ma.toFixed(2)];
    }
  });

  return newTable;
};

const addRSIColumn = (
  tableData: string[][],
  rsiLength: number,
  priceIndex: number
) => {
  const inputRSI = {
    values: tableData.map((row) => parseFloat(row[priceIndex])),
    period: rsiLength,
  };
  const newTable = addCustomColumn(
    tableData,
    RSI.calculate(inputRSI),
    rsiLength,
    "RSI"
  );
  return newTable;
};

const getRsiColor =
  (rsiRange: [number, number]) =>
  (indicatorValue: number, price: number): string =>
    indicatorValue > rsiRange[1]
      ? "#FFD700"
      : indicatorValue > (rsiRange[0] + rsiRange[1]) / 2
      ? "#FFF2AA"
      : indicatorValue > rsiRange[0]
      ? "#AAD3AA"
      : "#007C00";

const MaColor = (indicatorValue: number, price: number): string =>
  price > indicatorValue ? "#FFD700" : "#007C00";

const CustomizableIndicatorsDataTable = (
  props: CustomizableIndicatorsDataTableProps
) => {
  const [tableData, setTableData] = useState<string[][]>([]);
  const [columnColorMap, setColumnColorMap] = useState<
    Map<number, (indicatorValue: number, price: number) => string>
  >(new Map());

  useEffect(() => {
    const fetchTableData = async () => {
      let table = props.dataTable;

      table = addMAColumn(table, props.maLength, PRICE_INDEX);
      setColumnColorMap((Map) => Map.set(table[0]?.length - 1, MaColor));

      table = addRSIColumn(table, RSI_DAYS, PRICE_INDEX);
      const RsiColor = getRsiColor(props.rsiRange);
      setColumnColorMap((Map) => Map.set(table[0]?.length - 1, RsiColor));

      setTableData(table);
    };
    fetchTableData();
  }, [props.dataTable, props.maLength, props.rsiRange]);

  return (
    <Table
      tableData={tableData}
      ColumnIcon={ICONS}
      columnColorMap={columnColorMap}
    />
  );
};
export default CustomizableIndicatorsDataTable;
