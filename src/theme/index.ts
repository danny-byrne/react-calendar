import { PartialTheme } from '@fluentui/react';
import { defaultButtonStyles, primaryButtonStyles } from './ButtonStyles';
import { documentCardStyles } from './DocumentCardStyles';
import { dropdownStyles } from './DropdownStyles';
import { comboBoxStyles } from './ComboBoxStyles';
import { palette } from './Palette';
import { pivotStyles } from './PivotStyles';
import { semanticColors } from './SemanticColors';
import { textFieldStyles } from './TextFieldStyles';
import { datePickerStyles } from './DatePickerStyles';
import { SquareCheckboxStyles } from './CheckBoxStyles';
import { ToggleStyles } from './ToggleStyles';
import { SearchBoxStyles } from './SearchBoxStyles';
import { MessageBarStyles } from './MessageBarStyles';
import { modalStyles } from './ModalStyles';

export const theme: PartialTheme = {
    components: {
        DefaultButton: { styles: defaultButtonStyles },
        PrimaryButton: { styles: primaryButtonStyles },
        TextField: { styles: textFieldStyles },
        Dropdown: { styles: dropdownStyles },
        ComboBox: { styles: comboBoxStyles },
        DocumentCard: { styles: documentCardStyles },
        Pivot: { styles: pivotStyles },
        Checkbox: { styles: SquareCheckboxStyles },
        Toggle: { styles: ToggleStyles },
        SearchBox: { styles: SearchBoxStyles },
        MessageBar: { styles: MessageBarStyles },
        DatePicker: { styles: datePickerStyles },
        Modal: { styles: modalStyles },
    },
    effects: {
        roundedCorner2: '12px',
    },
    semanticColors: semanticColors,
    palette: palette,
};
