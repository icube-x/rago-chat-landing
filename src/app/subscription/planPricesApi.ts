import { apiBaseUrl } from '@/app/api/apiConfig';

export type PlanPriceCode = 'starter' | 'pro' | 'business';
export type PlanPriceMap = Partial<Record<PlanPriceCode, string>>;

type PlanPricesApiResponse = Record<string, unknown>;

const planCodes: PlanPriceCode[] = ['starter', 'pro', 'business'];

export async function fetchPlanPrices(languageCode: string): Promise<PlanPriceMap> {
  const url = new URL('/api/v2/subscription/plans/prices', apiBaseUrl);
  url.searchParams.set('lang', languageCode);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Plan prices API failed with ${response.status}`);
  }

  return normalizePlanPrices((await response.json()) as PlanPricesApiResponse, languageCode);
}

function normalizePlanPrices(payload: PlanPricesApiResponse, languageCode: string): PlanPriceMap {
  const data = readRecord(payload.data) ?? payload;
  const prices = readRecord(data.prices);
  if (!prices) return {};

  const preferredCurrency = languageCode === 'ko-KR' ? 'KRW' : 'USD';
  const result: PlanPriceMap = {};

  for (const planCode of planCodes) {
    const planPrices = readRecord(prices[planCode]);
    const monthlyPrice = readMonthlyPrice(planPrices, preferredCurrency) || readFirstMonthlyPrice(planPrices);

    if (monthlyPrice) {
      result[planCode] = monthlyPrice;
    }
  }

  return result;
}

function readMonthlyPrice(planPrices: PlanPricesApiResponse | undefined, currency: string): string {
  const currencyPrices = readRecord(planPrices?.[currency]);
  const monthlyPrice = readRecord(currencyPrices?.month);
  return readString(monthlyPrice?.amount_display);
}

function readFirstMonthlyPrice(planPrices: PlanPricesApiResponse | undefined): string {
  if (!planPrices) return '';

  for (const currencyPrices of Object.values(planPrices)) {
    const monthlyPrice = readRecord(readRecord(currencyPrices)?.month);
    const amountDisplay = readString(monthlyPrice?.amount_display);
    if (amountDisplay) return amountDisplay;
  }

  return '';
}

function readRecord(value: unknown): PlanPricesApiResponse | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as PlanPricesApiResponse) : undefined;
}

function readString(value: unknown): string {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}
