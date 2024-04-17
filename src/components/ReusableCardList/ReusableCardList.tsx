/* eslint-disable react/no-array-index-key */
import { Separator } from '@fluentui/react';
import { getClassNames } from './ReusableCardList.classNames';
import { CustomCard, CustomCardType } from './CustomCard/CustomCard';

const ReusableCardList = (props: IReusableCardListProps) => {
    const { buttonPropsList } = props;
    const classNames = getClassNames();
    const lastButtonIndex = buttonPropsList?.length - 1;

    return (
        <div className={classNames['wc-ReusableCardList--list']}>
            {buttonPropsList?.map((buttonProps, index) => {
                const buttonType = determineButtonType(index, lastButtonIndex);
                return (
                    <div key={index}>
                        {index !== 0 && <CardSeparator />}
                        <CustomCard {...buttonProps} key={`${index}-button`} buttonType={buttonType} />
                    </div>
                );
            })}
        </div>
    );
};

const CardSeparator = () => {
    const classNames = getClassNames();

    return (
        <div className={classNames['wc-ReusableCardList--separatorColorContainer']}>
            <div className={classNames['wc-ReusableCardList--separatorMarginContainer']}>
                <Separator className={classNames['wc-ReusableCardList--separator']} />
            </div>
        </div>
    );
};

interface IReusableCardListProps {
    buttonPropsList: {
        onClick?: () => void;
        icon?: any;
        customClass?: any;
        fill?: any;
        IconObject?: any;
        content?: any;
        header?: any;
        clickableContent?: any;
    }[];
}

const determineButtonType = (index: number, lastButtonIndex: number) => {
    let buttonType;
    switch (index) {
        case 0:
            buttonType = lastButtonIndex !== 0 ? CustomCardType.Top : CustomCardType.Only;
            break;
        case lastButtonIndex:
            buttonType = CustomCardType.Bottom;
            break;
        default:
            buttonType = CustomCardType.Middle;
    }

    return buttonType;
};

export default ReusableCardList;
