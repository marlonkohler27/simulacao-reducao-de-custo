const locale = "pt-BR";
const currency = new Intl.NumberFormat(locale, { style: "currency", currency: "BRL" });
const salary = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 4 });
const percentage = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 2 });

export const formatBRL = (value: number) => currency.format(value);
export const formatSalary = (value: number) => salary.format(value);
export const formatNumber = (value: number) => number.format(value);
export const formatPercent = (value: number) => percentage.format(value / 100);
