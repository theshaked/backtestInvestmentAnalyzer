import { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";

import CustomizableIndicatorsDataTable from "../../Components/CustomizableIndicatorsDataTable/CustomizableIndicatorsDataTable";
import Slider from "../../Components/Slider/Slider";

interface BacktrackProps {
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

const Backtrack = (props: BacktrackProps) => {
  const [dataTable, setDataTable] = useState<string[][]>([]);
  const [rsiSliderValues, setRsiSliderValues] = useState<number[]>([30, 70]);
  const [maSliderValue, setmaSliderValue] = useState<number>(150);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCsvData(props.csvUrl);
      setDataTable(data);
    };

    fetchData();
  }, [props.csvUrl]);

  const handleRsiSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setRsiSliderValues(value);
    }
  };
  const handleMaSliderChange = (value: number | number[]) => {
    if (typeof value === "number") {
      setmaSliderValue(value);
    }
  };

  const rsiSliderText = useMemo(() => {
    return `14 Days RSI Oversold : ${rsiSliderValues[0]} Overbought : ${rsiSliderValues[1]}`;
  }, [rsiSliderValues]);

  const MaSliderText = useMemo(() => {
    return `Moving Average : ${maSliderValue}`;
  }, [maSliderValue]);

  return (
    <div className="flex h-full gap-5 p-5">
      <CustomizableIndicatorsDataTable
        dataTable={dataTable}
        maLength={maSliderValue}
        rsiRange={[rsiSliderValues[0], rsiSliderValues[1]]}
      />
      <div className="flex w-1/3 flex-col gap-5 rounded-lg bg-secondary-dark p-5">
        <p className=" text-2xl text-foreground">
          Drag the sliders to adjust values:
        </p>
        <h2 className="text-lg text-foreground">{rsiSliderText}</h2>
        <Slider
          value={rsiSliderValues}
          min={0}
          max={100}
          onChange={handleRsiSliderChange}
          step={1}
        />
        <h2 className="text-lg text-foreground">{MaSliderText}</h2>

        <Slider
          value={maSliderValue}
          min={20}
          max={300}
          onChange={handleMaSliderChange}
          step={10}
        />
      </div>
    </div>
  );
};

export default Backtrack;
