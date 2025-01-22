import subDays from "date-fns/subDays";
import { subMonths, subYears } from "date-fns";

export const DefaultPageSize = 12;

export const predefinedStyle = {
  width: "100px",
  margin: "1px 5px",
};
export const predefinedRanges: any = [
  {
    label: "Past month",
    value: [
      subDays(new Date(), 30), // Date 30 days ago
      new Date(), // Current date
    ],
    placement: "left",
    appearance: "default",
    style: predefinedStyle, // Custom styles
  },
  {
    label: "Past 6 month",
    value: [
      subMonths(new Date(), 6), // Date 6 months ago
      new Date(), // Current date
    ],
    placement: "left",
    appearance: "default",
    style: predefinedStyle, // Custom styles
  },
  {
    label: "Past year",
    value: [subYears(new Date(), 1), new Date()],
    placement: "left",
    appearance: "default",
    style: predefinedStyle, // Custom styles
  },
  {
    label: "Past 2 year",
    value: [subYears(new Date(), 2), new Date()],
    placement: "left",
    appearance: "default",
    style: predefinedStyle, // Custom styles
  },
];
