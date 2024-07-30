// components/FormattedDate.tsx
import React from "react";

interface FormattedDateProps {
  dateString: string;
  format?: Intl.DateTimeFormatOptions;
  locale?: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({
  dateString,
  format,
  locale,
}) => {
  let formattedDate = "Invalid Date";

  try {
    const date = new Date(dateString);
    const defaultFormat: Intl.DateTimeFormatOptions = format || {
      year: "numeric",
      month: "long",
    };
    formattedDate = date.toLocaleDateString(locale, defaultFormat);
  } catch (error) {
    console.error("Error formatting date:", error);
  }

  return <span>{formattedDate}</span>;
};

export default FormattedDate;
