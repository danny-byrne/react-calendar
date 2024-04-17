import React from 'react';
import { Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton } from '@fluentui/react';
import { getClassNames } from './Buttons.classNames';
const dialogStyles = { main: { maxWidth: 450 } };

export enum PagesWithDelete {
    medication,
    member,
    condition,
    provider,
    pharmacy,
    immunization,
    allergy,
    activity,
    annotation,
    appointment,
}

const dialogContentPropList = [
    {
        screen: PagesWithDelete.medication,
        type: DialogType.normal,
        title: 'Delete Medication',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to delete this medication?',
    },
    {
        screen: PagesWithDelete.member,
        type: DialogType.normal,
        title: 'Remove Member',
        closeButtonAriaLabel: 'Close',
        subText: 'Do you want to remove this member from the Care Circle?',
    },
    {
        screen: PagesWithDelete.condition,
        type: DialogType.normal,
        title: 'Delete Condition',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to delete this condition?',
    },
    {
        screen: PagesWithDelete.provider,
        type: DialogType.normal,
        title: 'Remove provider',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to remove this provider?',
    },
    {
        screen: PagesWithDelete.pharmacy,
        type: DialogType.normal,
        title: 'Remove pharmacy',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to remove this pharmacy?',
    },
    {
        screen: PagesWithDelete.immunization,
        type: DialogType.normal,
        title: 'Remove immunization',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to remove this immunization?',
    },
    {
        screen: PagesWithDelete.allergy,
        type: DialogType.normal,
        title: 'Remove allergy',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to remove this allergy?',
    },
    {
        screen: PagesWithDelete.activity,
        type: DialogType.normal,
        title: 'Remove activity',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to remove this activity?',
    },
    {
        screen: PagesWithDelete.annotation,
        type: DialogType.normal,
        title: 'Remove annotation',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to remove this annotation?',
    },
    {
        screen: PagesWithDelete.appointment,
        type: DialogType.normal,
        title: 'Remove appointment',
        closeButtonAriaLabel: 'Close',
        subText: 'Are you sure you would like to remove this appointment?',
    },
];

interface DeleteDialogProps {
    onDelete: (e) => void;
    hidden: boolean;
    toggleHideDialog: () => void;
    screen: PagesWithDelete;
}
const DeleteDialog: React.FC<DeleteDialogProps> = ({ onDelete, hidden, toggleHideDialog, screen }) => {
    const modalProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: dialogStyles,
        }),
        [],
    );
    const classNames = getClassNames();

    // Is there a better way to handle this?
    const dialogContentProps = dialogContentPropList.find((prop) => prop.screen === screen);

    return (
        <Dialog
            hidden={hidden}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
        >
            <Dialog dialogContentProps={dialogContentProps} />
            <DialogFooter>
                <DefaultButton
                    onClick={toggleHideDialog}
                    text="Cancel"
                    className={classNames['wc-DialogButtons--defaultButton']}
                />
                <PrimaryButton onClick={onDelete} text="Delete" />
            </DialogFooter>
        </Dialog>
    );
};

export default DeleteDialog;
