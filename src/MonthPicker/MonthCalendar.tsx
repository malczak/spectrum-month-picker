/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import React from "react";

import { Flex, Grid, Heading, repeat, View } from "@adobe/react-spectrum";
import type { CalendarDate } from "@internationalized/date";
import {
  createCalendar,
  isSameDay,
  startOfYear,
} from "@internationalized/date";
import { useCalendar, useCalendarCell } from "@react-aria/calendar";
import { useFocusRing } from "@react-aria/focus";
import { useDateFormatter, useLocale } from "@react-aria/i18n";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { ActionButton } from "@react-spectrum/button";
import { useProviderProps } from "@react-spectrum/provider";
import { classNames, useStyleProps } from "@react-spectrum/utils";
import type { CalendarState } from "@react-stately/calendar";
import { useCalendarState } from "@react-stately/calendar";
import type { CalendarPropsBase } from "@react-types/calendar";
import type { DOMProps, StyleProps } from "@react-types/shared";
import ChevronLeft from "@spectrum-icons/ui/ChevronLeftLarge";
import ChevronRight from "@spectrum-icons/ui/ChevronRightLarge";

import _styles2 from "./MonthPicker.module.less";

const styles = { ..._styles2 };

const Months = [
  { area: "Jan", label: "Styczeń" },
  { area: "Fab", label: "Luty" },
  { area: "Mar", label: "Marzec" },
  { area: "Apr", label: "Kwiecien" },
  { area: "May", label: "Maj" },
  { area: "Jun", label: "Czerwiec" },
  { area: "Jul", label: "Lipec" },
  { area: "Aug", label: "Sierpień" },
  { area: "Sep", label: "Wrzesień" },
  { area: "Oct", label: "Październik" },
  { area: "Nov", label: "Listopad" },
  { area: "Dec", label: "Grudzień" },
];

const disabledCellColorStyle =
  "var(--spectrum-calendar-day-text-color-disabled,var(--spectrum-global-color-gray-500))";
const MonthCell = (props: {
  label: string;
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
}) => {
  const { label, state, ...otherProps } = props;
  const ref = React.useRef<HTMLElement>(null);
  const {
    cellProps,
    buttonProps,
    // isPressed,
    isSelected,
    isDisabled,
    // isFocused,
    isInvalid,
    // formattedDate,
  } = useCalendarCell(
    {
      ...otherProps,
      isDisabled: false,
    },
    state,
    ref
  );
  const isUnavailable = state.isCellUnavailable(props.date) && !isDisabled;
  const { focusProps } = useFocusRing();
  const { hoverProps, isHovered } = useHover({
    isDisabled: isDisabled || isUnavailable || state.isReadOnly,
  });

  let backgroundColor: React.CSSProperties["background"];
  if (isSelected) {
    backgroundColor = "var(--spectrum-global-color-blue-300)";
  } else if (isHovered) {
    backgroundColor = "var(--spectrum-global-color-gray-100)";
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: backgroundColor,
      }}
      {...mergeProps(buttonProps, hoverProps, focusProps)}
      {...cellProps}
    >
      <Flex
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <span ref={ref}>
          <span
            style={{
              cursor: "default",
              color:
                isDisabled || isUnavailable || isInvalid
                  ? disabledCellColorStyle
                  : undefined,
            }}
          >
            {label}
          </span>
        </span>
      </Flex>
    </div>
  );
};

const CalendarMonth = (props: {
  state: CalendarState;
  startDate: CalendarDate;
  [key: string]: any;
}) => {
  const { state, startDate } = props;
  const yearStartDate = startOfYear(startDate);
  const dates: CalendarDate[] = [];

  let date = yearStartDate.set({ day: 1 });
  while (dates.length < 12) {
    dates.push(date);
    const nextDate = date.add({ months: 1 });
    if (isSameDay(date, nextDate)) {
      // If the next day isis the same, we have hit the end of the calendar system.
      break;
    }
    date = nextDate;
  }

  return (
    <Grid
      areas={["Jan Fab Mar", "Apr May Jun", "Jul Aug Sep", "Oct Nov Dec"]}
      columns={repeat(3, "1fr")}
      rows={repeat(4, "size-600")}
      justifyContent="center"
      gap="size-100"
    >
      {Months.map((month, index) => (
        <View key={month.area} gridArea={month.area}>
          <MonthCell
            label={month.label}
            state={state}
            date={dates[index]}
            currentMonth={dates[index]}
          />
        </View>
      ))}
    </Grid>
  );
};

interface CalendarBaseProps extends CalendarPropsBase, DOMProps, StyleProps {}

export function MonthCalendar(props: CalendarBaseProps) {
  props = useProviderProps(props);
  const visibleDuration = { years: 1 };

  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    selectionAlignment: "start",
    locale,
    visibleDuration,
    createCalendar,
  });

  // const domRef = React.useRef<HTMLDivElement>(null);
  // useImperativeHandle(ref, () => ({
  //     ...createDOMRef(domRef),
  //     focus() {
  //         state.setFocused(true);
  //     },
  // }));

  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );

  const { styleProps } = useStyleProps(props);
  const { direction } = useLocale();
  const currentMonth = state.focusedDate ?? state.visibleRange.start;
  const monthDateFormatter = useDateFormatter({
    year: "numeric",
    era:
      currentMonth.calendar.identifier === "gregory" &&
      currentMonth.era === "BC"
        ? "short"
        : undefined,
    calendar: currentMonth.calendar.identifier,
    timeZone: state.timeZone,
  });

  const title = (
    <Flex width="100%" alignItems="center">
      <ActionButton
        {...prevButtonProps}
        UNSAFE_className={classNames(styles, "spectrum-Calendar-prevMonth")}
        isQuiet
      >
        {direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
      </ActionButton>
      <Flex flex="1" justifyContent="center">
        <Heading
          level={2}
          // We have a visually hidden heading describing the entire visible range,
          // and the calendar itself describes the individual month
          // so we don't need to repeat that here for screen reader users.
          aria-hidden
        >
          {monthDateFormatter.format(currentMonth.toDate(state.timeZone))}
        </Heading>
      </Flex>
      <ActionButton
        {...nextButtonProps}
        UNSAFE_className={classNames(styles, "spectrum-Calendar-nextMonth")}
        isQuiet
      >
        {direction === "rtl" ? <ChevronLeft /> : <ChevronRight />}
      </ActionButton>
    </Flex>
  );

  const calendar = (
    <CalendarMonth {...props} state={state} startDate={currentMonth} />
  );

  return (
    <div
      {...styleProps}
      {...calendarProps}
      className={classNames(styles, "spectrum-Calendar", styleProps.className)}
    >
      {/* Add a screen reader only description of the entire visible range rather than
       * a separate heading above each month grid. This is placed first in the DOM order
       * so that it is the first thing a touch screen reader user encounters.
       * In addition, VoiceOver on iOS does not announce the aria-label of the grid
       * elements, so the aria-label of the Calendar is included here as well. */}
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>
      <div className={classNames(styles, "spectrum-Calendar-header")}>
        {title}
      </div>
      <div className={classNames(styles, "spectrum-Calendar-months")}>
        {calendar}
      </div>
      {/* For touch screen readers, add a visually hidden next button after the month grid
       * so it's easy to navigate after reaching the end without going all the way
       * back to the start of the month. */}
      <VisuallyHidden>
        <button
          aria-label={nextButtonProps["aria-label"]}
          disabled={nextButtonProps.isDisabled}
          onClick={() => state.focusNextPage()}
          tabIndex={-1}
        />
      </VisuallyHidden>
    </div>
  );
}
