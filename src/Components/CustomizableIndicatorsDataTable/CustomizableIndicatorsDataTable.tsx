import { useState, useEffect } from "react";
import Table, { IndicatorValueWithStyle } from "../Table/Table";
import {
  BuySellDecision,
  MarketSentiment,
  ProfitBuyAndHold,
  TradeDecisionsData,
  calculateMaValues,
  calculateRSIValues,
  maMarketSentiment,
  rsiMarketSentiment,
} from "./IndicatorsUtls";

const PRICE_INDEX = 5;

interface CustomizableIndicatorsDataTableProps {
  dataTable: string[][];
  maLength: number;
  rsiRange: [number, number];
}

const marketSentimentColors: Record<MarketSentiment, string> = {
  Natural: "#FFFFFF",
  Undervalued: "#007C00",
  Bearish: "#AAD3AA",
  Bullish: "#FFF2AA",
  Overvalued: "#FFD700",
};

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
  let stockCurrBuyPrice = pricesNoHeader[0];
  for (let i = 0; i < pricesNoHeader.length; i++) {
    const StockPrice = pricesNoHeader[i];
    const rsiSentiment = Rsi[i].sentiment;
    const maSentiment = Ma[i].sentiment;
    if (
      (maSentiment === "Undervalued" || rsiSentiment === "Overvalued") &&
      stocks != 0
    ) {
      cash += stocks * (StockPrice - (StockPrice - stockCurrBuyPrice) * 0.25);
      stocks -= stocks;
    } else if (
      (maSentiment === "Overvalued" || rsiSentiment === "Undervalued") &&
      cash != 0
    ) {
      stockCurrBuyPrice = StockPrice;
      stocks += cash / StockPrice;
      cash -= cash;
    }
  }
  return (
    (stocks * pricesNoHeader[pricesNoHeader.length - 1] + cash) /
    pricesNoHeader[0]
  );
};

const StrategyDecisions = (
  prices: number[],
  maData: IndicatorValueWithStyle[],
  rsiData: IndicatorValueWithStyle[]
): BuySellDecision[] => {
  if (prices.length === 0 || maData.length === 0) {
    return []; // or any other appropriate value when pricesNoHeader or Ma is empty
  }

  const decisions: BuySellDecision[] = [{ index: 0, decision: "buy" }];

  for (let i = 1; i < prices.length; i++) {
    const rsiSentiment = rsiData[i].sentiment;
    const maSentiment = maData[i].sentiment;

    if (
      (maSentiment === "Undervalued" || rsiSentiment === "Overvalued") &&
      decisions[decisions.length - 1].decision !== "sell"
    ) {
      decisions.push({ index: i, decision: "sell" });
    } else if (
      (maSentiment === "Overvalued" || rsiSentiment === "Undervalued") &&
      decisions[decisions.length - 1].decision !== "buy"
    ) {
      decisions.push({ index: i, decision: "buy" });
    }
  }

  return decisions;
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

    const prefixedRsiValues = calculateRSIValues(pricesNoHeader);

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
  const pricesNoHeader = props.dataTable
    .slice(1)
    .map((row) => row[PRICE_INDEX])
    .map(parseFloat);
  const tradesData = TradeDecisionsData(
    pricesNoHeader,
    StrategyDecisions(pricesNoHeader, indicatorData.Ma, indicatorData.Rsi)
  );
  const profitBuyAndHold = ProfitBuyAndHold(pricesNoHeader);
  const profitStrategy = ProfitStrategy(
    pricesNoHeader,
    indicatorData.Ma,
    indicatorData.Rsi
  );
  return (
    <div className="grid">
      <Table tableData={props.dataTable} indicatorsData={indicatorData} />
      <h1 className="text-2xl text-foreground">
        {`profit of buy and hold = ${profitBuyAndHold.toFixed(3)}`}
      </h1>
      <h1 className="text-2xl text-foreground">
        {`profit of Strategy = ${profitStrategy.toFixed(3)}`}
      </h1>
      <h1 className="text-2xl text-foreground">
        {`Strategy did ${
          profitStrategy / profitBuyAndHold > 1 ? "better" : "worst"
        } in ${((profitStrategy / profitBuyAndHold - 1) * 100).toFixed(
          3
        )}% than buy and hold`}
      </h1>
      <h1 className="text-2xl text-foreground">
        {`Trades Data:
  Amount of Trades: ${tradesData.amountOfTrades}
  Average Trade Yield: ${tradesData.averageTradeYield.toFixed(3)}%
  Weighted Average Trade Yield: ${tradesData.weightedAverage.toFixed(3)}%
  Best Trade Yield: ${tradesData.bestTradeYield.toFixed(3)}%
  Worst Trade Yield: ${tradesData.worstTradeYield.toFixed(3)}%
  Shortest Sell to Buy: ${tradesData.shortestSellToBuy}
  Longest Sell to Buy: ${tradesData.longestSellToBuy}
  Max Drawdown: ${tradesData.maxDrawdown.toFixed(3)}`}
      </h1>
    </div>
  );
};
export default CustomizableIndicatorsDataTable;
