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

import type { ReactElement } from "react";
import React, { useRef } from "react";

import { endOfYear, startOfYear } from "@internationalized/date";
import { useDatePicker } from "@react-aria/datepicker";
import { useFocusRing } from "@react-aria/focus";
import { useLocale } from "@react-aria/i18n";
import { useHover } from "@react-aria/interactions";
import { mergeProps } from "@react-aria/utils";
import { FieldButton } from "@react-spectrum/button";
import { Dialog, DialogTrigger } from "@react-spectrum/dialog";
import { Field } from "@react-spectrum/label";
import { useProviderProps } from "@react-spectrum/provider";
import { classNames } from "@react-spectrum/utils";
import { Content } from "@react-spectrum/view";
import { useDatePickerState } from "@react-stately/datepicker";
import type {
  DateValue,
  SpectrumDatePickerProps,
} from "@react-types/datepicker";
import type { FocusableRef } from "@react-types/shared";
import CalendarIcon from "@spectrum-icons/workflow/Calendar";

import { MonthCalendar } from "./MonthCalendar";

import { DatePickerField } from "./DatePickerField";
import { Input } from "./Input";
import _styles2 from "./MonthPicker.module.less";
import { useFocusManagerRef } from "./utils";

const styles = { ..._styles2 };
const monthPickerStyles = {};

interface MonthPickerProps<T extends DateValue>
  extends Omit<SpectrumDatePickerProps<T>, "granularity"> {
  granularity?: "day" | "month";
}

function $MonthPicker<T extends DateValue>(
  props: MonthPickerProps<T>,
  ref: FocusableRef<HTMLElement>
) {
  props = useProviderProps(props);
  const { autoFocus, isQuiet, isDisabled, isReadOnly, minValue, maxValue } =
    props;
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const targetRef = useRef<HTMLDivElement>(null);
  const state: any = useDatePickerState({
    ...(props as SpectrumDatePickerProps<T>),
    granularity: undefined,
    shouldCloseOnSelect: () => true,
  });
  const {
    groupProps,
    labelProps,
    fieldProps,
    descriptionProps,
    errorMessageProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(
    {
      ...props,
      minValue: minValue ? startOfYear(minValue) : undefined,
      maxValue: maxValue ? endOfYear(maxValue) : undefined,
      isDateUnavailable: (date) =>
        (minValue && date.compare(minValue) < 0) ||
        (maxValue && date.compare(maxValue) > 0),
      granularity: undefined,
    } as SpectrumDatePickerProps<T>,
    state,
    targetRef
  );
  const { isOpen, setOpen } = state;
  const { direction } = useLocale();
  const domRef = useFocusManagerRef(ref);

  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    within: true,
    isTextInput: true,
    autoFocus,
  });

  const { isFocused: isFocusedButton, focusProps: focusPropsButton } =
    useFocusRing({
      within: false,
      isTextInput: false,
      autoFocus,
    });

  console.log(styles);

  const className = classNames(
    styles,
    "spectrum-InputGroup_a0942f spectrum-Field-field_d2db1f",
    {
      "spectrum-InputGroup--quiet": isQuiet,
      "spectrum-InputGroup--invalid":
        state.validationState === "invalid" && !isDisabled,
      "is-disabled_73bc77": isDisabled,
      "is-disabled_a0942f": isDisabled,
      "is-hovered": isHovered,
      "is-focused": isFocused,
      "focus-ring": isFocusVisible && !isFocusedButton,
    }
  );

  const fieldClassName = classNames(
    _styles2,
    "spectrum-Textfield-input_73bc77 spectrum-InputGroup-input_a0942f",
    {
      "is-disabled_73bc77": isDisabled,
      "is-disabled_a0942f": isDisabled,

      "is-invalid": state.validationState === "invalid" && !isDisabled,
    }
  );

  return (
    <Field
      {...props}
      ref={domRef}
      elementType="span"
      labelProps={labelProps}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      validationState={state.validationState}
      UNSAFE_className={classNames(
        monthPickerStyles,
        "react-spectrum-Datepicker-fieldWrapper"
      )}
    >
      <div
        {...mergeProps(groupProps, hoverProps, focusProps)}
        className={className}
        ref={targetRef}
      >
        <Input
          isDisabled={isDisabled}
          isQuiet={isQuiet}
          validationState={state.validationState}
          className={classNames(
            styles,
            "spectrum-Textfield_73bc77 react-spectrum-Datepicker-field_f02f90 spectrum-InputGroup-field_a0942f",
            {
              "is-disabled_73bc77": isDisabled,
              "is-disabled_a0942f": isDisabled,
            }
          )}
          inputClassName={fieldClassName}
          disableFocusRing
        >
          <DatePickerField
            {...fieldProps}
            granularity={props.granularity ?? "month"}
            data-testid="date-field"
            isQuiet={isQuiet}
            isDisabled={isDisabled}
          />
        </Input>
        <DialogTrigger
          type="popover"
          mobileType="tray"
          placement={direction === "rtl" ? "bottom right" : "bottom left"}
          targetRef={targetRef}
          hideArrow
          isOpen={isOpen}
          onOpenChange={setOpen}
          shouldFlip={props.shouldFlip}
        >
          <FieldButton
            {...mergeProps(buttonProps, focusPropsButton)}
            UNSAFE_className={classNames(
              styles,
              "spectrum-FieldButton_e2d99e spectrum-FieldButton_a0942f"
            )}
            isQuiet={isQuiet}
            validationState={state.validationState}
            isDisabled={isDisabled || isReadOnly}
          >
            <CalendarIcon />
          </FieldButton>
          <Dialog
            UNSAFE_className={classNames(
              monthPickerStyles,
              "react-spectrum-Datepicker-dialog"
            )}
            {...dialogProps}
          >
            <Content>
              <div
                className={classNames(
                  monthPickerStyles,
                  "react-spectrum-Datepicker-dialogContent"
                )}
              >
                <MonthCalendar
                  {...calendarProps}
                  defaultFocusedValue={
                    props.value ? startOfYear(props.value) : undefined
                  }
                  UNSAFE_className={classNames(
                    monthPickerStyles,
                    "react-spectrum-Datepicker-calendar",
                    {
                      "is-invalid": state.validationState === "invalid",
                    }
                  )}
                />
              </div>
            </Content>
          </Dialog>
        </DialogTrigger>
      </div>
    </Field>
  );
}

/**
 * DatePickers combine a DateField and a Calendar popover to allow users to enter or select a date and time value.
 */
export const MonthPicker = React.forwardRef($MonthPicker) as <
  T extends DateValue
>(
  props: MonthPickerProps<T> & { ref?: FocusableRef<HTMLElement> }
) => ReactElement;
