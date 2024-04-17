import { getClassNames } from './CustomCard.classNames';
import { Stack } from '@fluentui/react';

export const CustomCard = (props: ICustomCardProps) => {
    const { header, content, onClick, buttonType, customClass, clickableContent } = props;
    const classNames = getClassNames(buttonType, customClass);

    return (
        <Stack onClick={onClick} className={classNames['wc-CustomCard--container']}>
            {header && <div className={classNames['wc-CustomCard--cardHeader']}>{header}</div>}
            {content && (
                <Stack tokens={{ childrenGap: 12 }} className={classNames['wc-CustomCard--cardContent']}>
                    {content}
                </Stack>
            )}
            {clickableContent && (
                <div className={classNames['wc-CustomCard--clickableCardContent']}>{clickableContent}</div>
            )}
        </Stack>
    );
};

interface ICustomCardProps {
    content?: any;
    clickableContent?: any;
    header?: any;
    onClick?: () => void;
    buttonType: CustomCardType;
    icon?: string;
    customClass?: any;
    fill?: any;
    IconObject?: any;
}

export enum CustomCardType {
    'Top',
    'Middle',
    'Bottom',
    'Only',
}
