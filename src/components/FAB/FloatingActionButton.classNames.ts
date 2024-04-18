import { FontWeights, mergeStyleSets } from '@fluentui/react';
import { BREAKPOINTS, MAX_WIDTH_BREAKPOINT } from 'src/app/Breakpoints';
import { colors } from 'src/common/styles/colors';

interface IFABClassNames {
    'wc-FloatingActionButton--fab': string;
    'wc-FloatingActionButton--fabWithText': string;
    'wc-FloatingActionButton--copyLinkContainer': string;
    'wc-FloatingActionButton--emailContainer': string;
    'wc-FloatingActionButton--icon': string;
    'wc-FloatingActionButton--fabHeaderText': string;
    'wc-FloatingActionButton--fabContainer': string;
}

// TODO: DRY this out
export const getClassNames = (disabled: boolean): IFABClassNames => {
    const fabContainerRightOffset =
        window.innerWidth < MAX_WIDTH_BREAKPOINT
            ? window.innerWidth - 30
            : window.innerWidth / 2 + MAX_WIDTH_BREAKPOINT / 2 - 20;

    return mergeStyleSets({
        'wc-FloatingActionButton--fab': {
            width: '3rem',
            height: '3rem',
            borderRadius: '1.563rem',
            backgroundColor: colors.windcrest.fabBackground,
            color: colors.fabric.neutrals.white,
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            position: 'absolute',
            boxShadow: '0px 1.2px 3.6px rgba(0, 0, 0, 0.1), 0px 6.4px 14.4px rgba(0, 0, 0, 0.13);',
            right: '0',
            ':hover': {
                backgroundColor: colors.windcrest.fabBackground,
                color: colors.fabric.neutrals.white,
            },
            ':active': {
                backgroundColor: colors.windcrest.fabBackground,
                color: colors.fabric.neutrals.white,
            },
        },
        'wc-FloatingActionButton--fabWithText': [
            {
                width: '3rem',
                height: '3rem',
                borderRadius: '1.563rem',
                backgroundColor: colors.windcrest.pageBackground,
                display: 'flex',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                flexWrap: 'nowrap',
                boxShadow: '0px 1.2px 3.6px rgba(0, 0, 0, 0.1), 0px 6.4px 14.4px rgba(0, 0, 0, 0.13);',
                border: `1px solid ${colors.fabric.neutrals.WCprimary}`,
            },
            disabled && {
                backgroundColor: colors.fabric.neutrals.gray50,
            },
        ],
        'wc-FloatingActionButton--copyLinkContainer': {
            position: 'fixed',
            bottom: `calc(100% - ${window.innerHeight - 240}px)`,
            right: `calc(100% - ${fabContainerRightOffset}px)`,
            alignItems: 'center',
            [BREAKPOINTS.DESKTOP_HEIGHT]: {
                bottom: `calc(50% - 170px)`,
            },
        },
        'wc-FloatingActionButton--uploadDocumentContainer': {
            position: 'fixed',
            bottom: `calc(100% - ${window.innerHeight - 240}px)`,
            right: `calc(100% - ${fabContainerRightOffset}px)`,
            alignItems: 'center',
        },
        'wc-FloatingActionButton--emailContainer': {
            position: 'fixed',
            bottom: `calc(100% - ${window.innerHeight - 170}px)`,
            right: `calc(100% - ${fabContainerRightOffset}px)`,
            alignItems: 'center',
            [BREAKPOINTS.DESKTOP_HEIGHT]: {
                bottom: `calc(50% - 235px)`,
            },
        },
        'wc-FloatingActionButton--icon': {
            fontSize: '20px',
            color: colors.fabric.neutrals.WCprimary,
        },
        'wc-FloatingActionButton--fabHeaderText': {
            fontWeight: FontWeights.semibold,
            fontSize: '0.875rem',
        },
        'wc-FloatingActionButton--fabContainer': {
            position: 'fixed',
            bottom: `calc(100% - ${window.innerHeight - 150}px)`,
            right: `calc(100% - ${fabContainerRightOffset}px)`,
            backgroundColor: colors.windcrest.pageBackground,
            [BREAKPOINTS.DESKTOP_HEIGHT]: {
                bottom: `calc(50% - 250px)`,
            },
        },
    });
};
