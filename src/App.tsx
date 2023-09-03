import { useState } from "react";
import "./App.css";

import {
  DatePicker,
  Flex,
  IllustratedMessage,
  ProgressBar,
  Provider as Spectrum,
} from "@adobe/react-spectrum";
import { customTheme } from "./theme";
import { MonthPicker } from "./MonthPicker/MonthPicker";

function App() {
  return (
    <Spectrum
      locale="pl-PL"
      theme={customTheme}
      flex="1 1"
      width="100%"
      height="100%"
    >
      <Flex direction="row" gap="size-200">
        <Flex direction="column" gap="size-100">
          <h4>Date picker</h4>
          <DatePicker />
        </Flex>
        <Flex direction="column" gap="size-100">
          <h4>Month picker</h4>
          <MonthPicker />
        </Flex>
      </Flex>
    </Spectrum>
  );
}

export default App;
