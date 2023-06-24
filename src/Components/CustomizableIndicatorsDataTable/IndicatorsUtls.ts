import { RSI } from "technicalindicators";

const RSI_DAYS = 14 * 2; //TODO ADD SLIDER FOR THIS

//todo remove export to table (its un export to a child)
export type MarketSentiment =
  | "Natural"
  | "Undervalued"
  | "Bearish"
  | "Bullish"
  | "Overvalued";

export type BuySell = "buy" | "sell";

export interface BuySellDecision {
  index: number;
  decision: BuySell;
}

export interface TradesData {
  tradeYields: number[];
  amountOfTrades: number;
  averageTradeYield: number;
  weightedAverage: number;
  bestTradeYield: number;
  worstTradeYield: number;
  shortestSellToBuy: number;
  longestSellToBuy: number;
  maxDrawdown: number;
}

export const ProfitBuyAndHold = (pricesNoHeader: number[]) =>
  (pricesNoHeader[pricesNoHeader.length - 1] -
    (pricesNoHeader[pricesNoHeader.length - 1] - pricesNoHeader[0]) * 0.25) /
  pricesNoHeader[0];

export const calculateMaValues = (
  prices: number[],
  maLength: number
): number[] => {
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

export const calculateRSIValues = (prices: number[]): number[] => {
  const calculatedRsiValues = RSI.calculate({
    period: RSI_DAYS,
    values: prices,
  });

  const prefixedRsiValues = Array(RSI_DAYS)
    .fill(undefined)
    .concat(calculatedRsiValues);

  return prefixedRsiValues;
};

export const maMarketSentiment = (
  Ma: number[],
  Prices: number[]
): MarketSentiment[] => {
  return Prices.map((price, index) =>
    price > Ma[index] ? "Overvalued" : "Undervalued"
  );
};

export const rsiMarketSentiment = (
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

const calculateDrawdown = (
  prices: number[],
  start: number,
  end: number
): number => {
  const highestHoldPrice = Math.max(...prices.slice(start, end + 1));
  const lowestDecliningPrice = Math.min(
    ...prices.slice(prices.indexOf(highestHoldPrice), end)
  );
  return ((highestHoldPrice - lowestDecliningPrice) / highestHoldPrice) * 100;
};

const calculateTradeYields = (
  prices: number[],
  decisions: BuySellDecision[]
): number[] => {
  const tradeYields: number[] = [];

  decisions.forEach((decision, index) => {
    if (index % 2 === 1) {
      const sellIndex = decisions[index - 1].index;
      const buyIndex = decision.index;
      const sellPrice = prices[sellIndex];
      const buyPrice = prices[buyIndex];
      const tradeProfit = (sellPrice / buyPrice - 1) * 100;
      tradeYields.push(tradeProfit);
    }
  });

  return tradeYields;
};

const calculateShortestSellToBuy = (decisions: BuySellDecision[]): number => {
  let shortestSellToBuy = Infinity;

  decisions.forEach((decision, index) => {
    if (index % 2 === 0 && index >= 2) {
      const sellIndex = decisions[index - 1].index;
      const buyIndex = decision.index;
      const sellToBuyGap = buyIndex - sellIndex;
      shortestSellToBuy = Math.min(shortestSellToBuy, sellToBuyGap);
    }
  });

  return shortestSellToBuy;
};

const calculateLongestSellToBuy = (decisions: BuySellDecision[]): number => {
  let longestSellToBuy = -Infinity;

  decisions.forEach((decision, index) => {
    if (index % 2 === 0 && index >= 2) {
      const sellIndex = decisions[index - 1].index;
      const buyIndex = decision.index;
      const sellToBuyGap = buyIndex - sellIndex;
      longestSellToBuy = Math.max(longestSellToBuy, sellToBuyGap);
    }
  });

  return longestSellToBuy;
};

const calculateMaxDrawdown = (
  prices: number[],
  decisions: BuySellDecision[]
): number => {
  let maxDrawdown = -Infinity;

  decisions.forEach((decision, index) => {
    if (index % 2 === 1) {
      const sellIndex = decisions[index - 1].index;
      const buyIndex = decision.index;
      const drawdown = calculateDrawdown(prices, sellIndex, buyIndex + 1);
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  });

  return maxDrawdown;
};

export const TradeDecisionsData = (
  prices: number[],
  decisions: BuySellDecision[]
): TradesData => {
  const tradeYields = calculateTradeYields(prices, decisions);
  const weightedAverage = calculateWeightedAverage(prices, decisions);
  const shortestSellToBuy = calculateShortestSellToBuy(decisions);
  const longestSellToBuy = calculateLongestSellToBuy(decisions);
  const maxDrawdown = calculateMaxDrawdown(prices, decisions);

  const amountOfTrades = tradeYields.length;
  const averageTradeYield =
    tradeYields.reduce((sum, profit) => sum + profit, 0) / amountOfTrades;
  const bestTradeYield = Math.max(...tradeYields);
  const worstTradeYield = Math.min(...tradeYields);

  return {
    tradeYields,
    amountOfTrades,
    averageTradeYield,
    weightedAverage,
    bestTradeYield,
    worstTradeYield,
    shortestSellToBuy,
    longestSellToBuy,
    maxDrawdown,
  };
};
const calculateWeightedAverage = (
  prices: number[],
  decisions: BuySellDecision[]
): number => {
  let weightSum = 0;
  let weightedValuesSum = 0;
  decisions.forEach((decision, index) => {
    if (decision.decision === "buy" && index != 0) {
      const rebuyIndex = decision.index;
      const sellIndex = decisions[index - 1].index;

      const rebuyPrice = prices[rebuyIndex];
      const sellPrice = prices[sellIndex];

      const profit = (sellPrice / rebuyPrice - 1) * 100;

      const weight = (rebuyIndex + sellIndex) / 2;
      const weightedValue = profit * weight;

      weightSum += weight;
      weightedValuesSum += weightedValue;
    }
  });
  return weightedValuesSum / weightSum;
};
