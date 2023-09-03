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

import React, { useRef } from "react";

import { useFocusRing } from "@react-aria/focus";
import { mergeProps, mergeRefs } from "@react-aria/utils";
import { classNames } from "@react-spectrum/utils";
import Alert from "@spectrum-icons/ui/AlertMedium";
import Checkmark from "@spectrum-icons/ui/CheckmarkMedium";
import styles from "./MonthPicker.module.less";

const datepickerStyles = {};
const textfieldStyles = {};

function $Input(props: any, ref: any) {
  const inputRef = useRef(null);
  const {
    isDisabled,
    isQuiet,
    inputClassName,
    validationState,
    children,
    fieldProps,
    className,
    style,
    disableFocusRing,
  } = props;

  const { focusProps, isFocusVisible, isFocused } = useFocusRing({
    isTextInput: true,
    within: true,
  });

  const isInvalid = validationState === "invalid" && !isDisabled;
  const textfieldClass = classNames(
    textfieldStyles,
    "spectrum-Textfield",
    {
      "spectrum-Textfield--invalid": isInvalid,
      "spectrum-Textfield--valid": validationState === "valid" && !isDisabled,
      "spectrum-Textfield--quiet": isQuiet,
      "focus-ring": isFocusVisible && !disableFocusRing,
    },
    classNames(datepickerStyles, "react-spectrum-Datepicker-field"),
    className
  );

  const inputClass = classNames(
    textfieldStyles,
    "",
    {
      "is-disabled": isDisabled,
      "is-invalid": isInvalid,
      "is-focused": isFocused,
    },
    inputClassName
  );

  const iconClass = classNames(
    textfieldStyles,
    "spectrum-Textfield-validationIcon"
  );

  let validationIcon = null;
  if (validationState === "invalid" && !isDisabled) {
    validationIcon = (
      <Alert data-testid="invalid-icon" UNSAFE_className={iconClass} />
    );
  } else if (validationState === "valid" && !isDisabled) {
    validationIcon = (
      <Checkmark data-testid="valid-icon" UNSAFE_className={iconClass} />
    );
  }

  return (
    <div
      role="presentation"
      {...mergeProps(fieldProps, focusProps)}
      className={textfieldClass}
      style={style}
    >
      <div role="presentation" className={inputClass}>
        <div
          role="presentation"
          className={classNames(
            {},
            styles["react-spectrum-Datepicker-inputContents"],
            "react-spectrum-Datepicker-inputContents"
          )}
          ref={mergeRefs(ref, inputRef)}
        >
          {children}
        </div>
      </div>
      {validationIcon}
    </div>
  );
}

export const Input = React.forwardRef($Input);
