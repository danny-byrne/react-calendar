import React from 'react';
import { getClassNames } from './MicrosoftLogo.classNames';

const msRed = '#F34F1C',
    msGreen = '#7FBC00',
    msBlue = '#01A6F0',
    msYellow = '#FFBA01';
const squareColors = [msRed, msGreen, msBlue, msYellow];

interface IMSLogoProps {
    monotone?: boolean;
}

export const MicrosoftLogo: React.FC<IMSLogoProps> = (props) => {
    const { monotone } = props;
    const classNames = getClassNames();
    return (
        <div className={classNames['wc-MicrosoftLogo--logoContainer']}>
            {squareColors.map((color) => {
                return (
                    <div
                        key={color}
                        className={classNames['wc-MicrosoftLogo--square']}
                        style={{ backgroundColor: monotone ? '#333333' : color }}
                    />
                );
            })}
        </div>
    );
};
