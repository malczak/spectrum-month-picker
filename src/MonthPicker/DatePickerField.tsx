/* eslint-disable react/no-array-index-key */
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

import React, { useRef } from 'react';

import { createCalendar } from '@internationalized/date';
import { useDateField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { classNames } from '@react-spectrum/utils';
import { useDateFieldState } from '@react-stately/datepicker';
import type {
    DateValue,
    SpectrumDatePickerProps,
} from '@react-types/datepicker';

import { DatePickerSegment } from './DatePickerSegment';
import _styles2 from './MonthPicker.module.less';

const datepickerStyles = { ..._styles2 };

interface DatePickerFieldProps<T extends DateValue>
    extends Omit<SpectrumDatePickerProps<T>, 'granularity'> {
    inputClassName?: string;
    hideValidationIcon?: boolean;
    granularity?: SpectrumDatePickerProps<T>['granularity'] | 'day' | 'month';
    maxGranularity?: SpectrumDatePickerProps<T>['granularity'];
}

export function DatePickerField<T extends DateValue>(
    props: DatePickerFieldProps<T>
) {
    const { isDisabled, isReadOnly, isRequired, inputClassName } = props;
    const ref = useRef<HTMLDivElement>(null);
    const { locale } = useLocale();
    const state = useDateFieldState({
        ...props,
        locale,
        createCalendar,
    } as any);

    const { fieldProps } = useDateField(
        { ...props, granularity: undefined } as SpectrumDatePickerProps<T>,
        state,
        ref
    );

    return (
        <div
            {...fieldProps}
            className={classNames(
                datepickerStyles,
                'react-spectrum-Datepicker-segments',
                inputClassName
            )}
            ref={ref}>
            {state.segments.map((segment, i) => (
                <DatePickerSegment
                    key={i}
                    segment={segment}
                    state={state}
                    isDisabled={isDisabled}
                    isReadOnly={isReadOnly}
                    isRequired={isRequired}
                />
            ))}
        </div>
    );
}
