/**
 * Currency formatting utilities for VoyageAI.
 *
 * Use `formatCurrencyCompact` in small stat cards where space is constrained.
 * Use `formatCurrency` (full format) everywhere else: tooltips, tables, detail pages.
 */

/**
 * Formats a number as a full USD currency string.
 * Example: 58300 → "$58,300"
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a number as a compact USD currency string for use in small cards.
 * Example: 58300 → "$58.3K"  |  1250000 → "$1.3M"
 */
export const formatCurrencyCompact = (value: number): string => {
  if (value === 0) return "$0";
  return (
    "$" +
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  );
};
