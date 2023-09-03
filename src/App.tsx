import "./App.css";

import {
  DatePicker,
  Flex,
  Provider as Spectrum,
  Text,
  View,
} from "@adobe/react-spectrum";
import { CalendarDate, DateValue } from "@internationalized/date";

import { customTheme } from "./theme";
import { MonthPicker } from "./MonthPicker/MonthPicker";
import React from "react";

const minDate = new CalendarDate(2022, 12, 6);
const maxDate = new CalendarDate(2025, 12, 6);

const PickerBase = (props: { cls: typeof DatePicker | typeof MonthPicker }) => {
  const { cls: Component } = props;
  const [value, setValue] = React.useState<CalendarDate | undefined>(undefined);

  return (
    <>
      <Text>{value ? value.toString() : "\u00A0"}</Text>
      <Component<CalendarDate>
        minValue={minDate}
        maxValue={maxDate}
        value={value}
        onChange={setValue}
      />
    </>
  );
};

const DatePickerCmp = () => {
  return <PickerBase cls={DatePicker} />;
};

const MonthPickerCmp = () => {
  return <PickerBase cls={MonthPicker} />;
};

function App() {
  return (
    <Spectrum
      locale="pl-PL"
      theme={customTheme}
      flex="1 1"
      width="100%"
      height="100%"
    >
      <Flex width="100%" height="100%" direction="column" alignItems="center">
        <Flex direction="row" gap="size-200">
          <Flex direction="column" gap="size-100">
            <h4>Date picker</h4>
            <DatePickerCmp />
          </Flex>
          <Flex direction="column" gap="size-100">
            <h4>Month picker</h4>
            <MonthPickerCmp />
          </Flex>
        </Flex>
        <View paddingTop="size-400">
          <Flex direction="column" gap="size-100">
            <Text>Minimum date allowed to select is: {minDate.toString()}</Text>
            <Text>Maximum date allowed to select is: {maxDate.toString()}</Text>
          </Flex>
        </View>
      </Flex>
    </Spectrum>
  );
}

export default App;
