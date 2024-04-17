import React from 'react';
import { Dialog, DialogType, DialogFooter, PrimaryButton, DefaultButton } from '@fluentui/react';
import { getClassNames } from './Buttons.classNames';

const dialogStyles = { main: { maxWidth: 450 } };

const dialogContentProps = {
    type: DialogType.normal,
    title: 'Remove Member',
    closeButtonAriaLabel: 'Close',
    subText: 'Removing this member will permanently block them from accessing the care circle.',
};

interface RemoveMemberDialogProps {
    onDelete: (e) => void;
    hidden: boolean;
    toggleHideDialog: () => void;
}
const RemoveMemberDialog: React.FC<RemoveMemberDialogProps> = ({ hidden, toggleHideDialog, onDelete }) => {
    const modalProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: dialogStyles,
        }),
        [],
    );
    const classNames = getClassNames();

    return (
        <Dialog
            hidden={hidden}
            onDismiss={toggleHideDialog}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
        >
            <Dialog dialogContentProps={dialogContentProps} />
            <DialogFooter>
                <PrimaryButton onClick={onDelete} text="Confirm" />
                <DefaultButton
                    onClick={toggleHideDialog}
                    text="Cancel"
                    className={classNames['wc-DialogButtons--defaultButton']}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default RemoveMemberDialog;
