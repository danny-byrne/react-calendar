import React, { forwardRef, ForwardedRef } from 'react';
import { getClassNames } from './PrintableContentContainer.classNames';

interface PrintableContentProps {
    children: React.ReactNode;
}

const PrintableContentContainer = forwardRef(function PrintableContentContainer(
    props: PrintableContentProps,
    ref: ForwardedRef<HTMLDivElement>,
) {
    const classNames = getClassNames();

    return (
        <div className={classNames['wc-PrintableContent--printableContent']} ref={ref}>
            <style type="text/css" media="print">
                {
                    '\
  @page { size: landscape; }\
'
                }
            </style>
            {props.children}
        </div>
    );
});

export default PrintableContentContainer;
