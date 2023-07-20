import { ChangeEvent, useCallback, useState } from "react";

import { isValid, parse } from "date-fns";

export const useCustomDatePicker = (
  setCustomValue: (id: string, value: any) => void
) => {
  const [customDate, setCustomDate] = useState("");

  const onCustomDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setCustomDate(event.currentTarget.value);
      const isDate = parse(event.currentTarget.value, "PP", new Date());
      if (isValid(isDate)) {
        setCustomValue("dob", isDate);
      } else {
        setCustomValue("dob", undefined);
      }
    },
    [setCustomValue]
  );

  return { customDate, setCustomDate, onCustomDateChange };
};
