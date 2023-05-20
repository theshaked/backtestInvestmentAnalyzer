import { useState, useEffect } from "react";
import Table, { IndicatorValueWithStyle } from "../Table/Table";
import { RSI } from "technicalindicators";

interface CustomizableIndicatorsDataTableProps {
  dataTable: string[][];
  maLength: number;
  rsiRange: [number, number];
}
const PRICE_INDEX = 5;
const RSI_DAYS = 14 * 2; //TODO ADD SLIDER FOR THIS

//todo remove export to table (its un export to a child)
export type MarketSentiment =
  | "Natural"
  | "Undervalued"
  | "Bearish"
  | "Bullish"
  | "Overvalued";

const calculateMaValues = (prices: number[], maLength: number): number[] => {
  const maValues: number[] = new Array(prices.length).fill(undefined);

  if (maLength <= 0 || prices.length < maLength) {
    return maValues;
  }

  let sum = 0;

  for (let i = 0; i < maLength; i++) {
    sum += prices[i];
  }

  maValues[maLength - 1] = sum / maLength;

  for (let i = maLength; i < prices.length; i++) {
    sum += prices[i] - prices[i - maLength];
    maValues[i] = sum / maLength;
  }

  return maValues;
};

const maMarketSentiment = (
  Ma: number[],
  Prices: number[]
): MarketSentiment[] => {
  return Prices.map((price, index) =>
    price > Ma[index] ? "Overvalued" : "Undervalued"
  );
};

const rsiMarketSentiment = (
  Rsi: number[],
  Prices: number[],
  rsiRange: [number, number]
): MarketSentiment[] => {
  return Prices.map((price, index) =>
    Rsi[index] > rsiRange[1]
      ? "Overvalued"
      : Rsi[index] > (rsiRange[0] + rsiRange[1]) / 2
      ? "Bullish"
      : Rsi[index] > rsiRange[0]
      ? "Bearish"
      : "Undervalued"
  );
};

const marketSentimentColors: Record<MarketSentiment, string> = {
  Natural: "#FFFFFF",
  Undervalued: "#007C00",
  Bearish: "#AAD3AA",
  Bullish: "#FFF2AA",
  Overvalued: "#FFD700",
};

const ProfitBuyAndHold = (pricesNoHeader: number[]) =>
  pricesNoHeader[pricesNoHeader.length - 1] / pricesNoHeader[0];

const ProfitStrategy = (
  pricesNoHeader: number[],
  Ma: IndicatorValueWithStyle[],
  Rsi: IndicatorValueWithStyle[]
): number => {
  if (pricesNoHeader.length === 0 || Ma.length === 0) {
    return 0; // or any other appropriate value when pricesNoHeader or Ma is empty
  }
  let cash = 0;
  let stocks = 1;
  let trades = 0;
  // console.log(`cash=${cash} stocks=${stocks} @@@@@@@@@@@@@@@@@@@@@@@`);
  for (let i = 0; i < pricesNoHeader.length; i++) {
    const StockPrice = pricesNoHeader[i];
    if (
      Rsi[i].sentiment === "Overvalued" &&
      Ma[i].sentiment === "Overvalued" &&
      stocks != 0
    ) {
      cash += stocks * StockPrice;
      stocks -= stocks;
      trades++;
      // console.log(`cash=${cash} stocks=${stocks} index of ${i}`);
    } else if (Rsi[i].sentiment === "Undervalued" && cash != 0) {
      stocks += cash / StockPrice;
      cash -= cash;
      trades++;
      // console.log(`cash=${cash} stocks=${stocks} index of ${i}`);
    }
  }
  // console.log(`@@@@@@@@@@@@ cash=${cash} stocks=${stocks} number of trades ${trades}`);
  return (
    (stocks * pricesNoHeader[pricesNoHeader.length - 1] + cash) /
    pricesNoHeader[0]
  );
};

const CustomizableIndicatorsDataTable = (
  props: CustomizableIndicatorsDataTableProps
) => {
  const [indicatorData, setIndicatorData] = useState<{
    Ma: IndicatorValueWithStyle[];
    Rsi: IndicatorValueWithStyle[];
  }>({
    Ma: [],
    Rsi: [],
  });

  useEffect(() => {
    const pricesNoHeader = props.dataTable
      .slice(1)
      .map((row) => row[PRICE_INDEX])
      .map(parseFloat);
    const calculatedMaValues = calculateMaValues(
      pricesNoHeader,
      props.maLength
    );
    const maSentiment = maMarketSentiment(calculatedMaValues, pricesNoHeader);

    const maDataWithStyle: IndicatorValueWithStyle[] = pricesNoHeader.map(
      (price, i) => ({
        value: calculatedMaValues[i],
        color: marketSentimentColors[maSentiment[i]],
        sentiment: maSentiment[i],
      })
    );
    setIndicatorData((data) => ({ ...data, Ma: maDataWithStyle }));
  }, [props.maLength, props.dataTable]);

  useEffect(() => {
    const pricesNoHeader = props.dataTable
      .slice(1)
      .map((row) => row[PRICE_INDEX])
      .map(parseFloat);
    const calculatedRsiValues = RSI.calculate({
      period: RSI_DAYS,
      values: pricesNoHeader,
    });

    const prefixedRsiValues = Array(RSI_DAYS)
      .fill(undefined)
      .concat(calculatedRsiValues);

    const rsiSentiment = rsiMarketSentiment(
      prefixedRsiValues,
      pricesNoHeader,
      props.rsiRange
    );
    const rsiDataWithStyle: IndicatorValueWithStyle[] = pricesNoHeader.map(
      (price, i) => ({
        value: prefixedRsiValues[i],
        color: marketSentimentColors[rsiSentiment[i]],
        sentiment: rsiSentiment[i],
      })
    );
    setIndicatorData((data) => ({ ...data, Rsi: rsiDataWithStyle }));
  }, [props.rsiRange, props.dataTable]);

  return (
    <div className="grid">
      <Table tableData={props.dataTable} indicatorsData={indicatorData} />
      <h1 className="text-2xl text-foreground">
        {`profit of buy and hold = ${ProfitBuyAndHold(
          props.dataTable
            .slice(1)
            .map((row) => row[PRICE_INDEX])
            .map(parseFloat)
        ).toFixed(3)}`}
      </h1>
      <h1 className="text-2xl text-foreground">
        {`profit of Strategy = ${ProfitStrategy(
          props.dataTable
            .slice(1)
            .map((row) => row[PRICE_INDEX])
            .map(parseFloat),
          indicatorData.Ma,
          indicatorData.Rsi
        ).toFixed(3)}`}
      </h1>
    </div>
  );
};
export default CustomizableIndicatorsDataTable;
