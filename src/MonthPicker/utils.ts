import { useImperativeHandle, useRef } from 'react';

import { createFocusManager } from '@react-aria/focus';
import { createDOMRef } from '@react-spectrum/utils';
import type { FocusableRef } from '@react-types/shared';

export function useFocusManagerRef(ref: FocusableRef<HTMLElement>) {
    const domRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => ({
        ...createDOMRef(domRef),
        focus() {
            createFocusManager(domRef).focusFirst({ tabbable: true });
        },
    }));
    return domRef;
}
