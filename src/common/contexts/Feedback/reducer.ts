export const DISPATCH_MESSAGES = {
    setErrorFullscreen: 'setErrorFullscreen',
    clearErrorFullscreen: 'clearErrorFullscreen',
    setErrorToast: 'setErrorToast',
    setSuccessToast: 'setSuccessToast',
    setInfoToast: 'setInfoToast',
    clearFeedback: 'clearFeedback',
};

export const reducer = (state, action) => {
    switch (action.type) {
        case DISPATCH_MESSAGES.setErrorFullscreen:
            return {
                hasErrorFullscreen: true,
                hasErrorToast: false,
                hasSuccessToast: false,
                hasInfoToast: false,
                message: action.payload.message,
                title: null,
                actionText: null,
                actionOnClick: () => null,
            };
        case DISPATCH_MESSAGES.clearErrorFullscreen:
            return {
                hasErrorFullscreen: false,
                hasErrorToast: false,
                hasSuccessToast: false,
                hasInfoToast: false,
                message: null,
                title: null,
                actionText: null,
                actionOnClick: () => null,
            };
        case DISPATCH_MESSAGES.setErrorToast:
            return {
                hasErrorFullscreen: false,
                hasErrorToast: true,
                hasSuccessToast: false,
                hasInfoToast: false,
                message: action.payload.message,
                title: action.payload.title,
                actionText: action.payload.actionText,
                actionOnClick: action.payload.actionOnClick,
            };
        case DISPATCH_MESSAGES.setSuccessToast:
            return {
                hasErrorFullscreen: false,
                hasErrorToast: false,
                hasSuccessToast: true,
                hasInfoToast: false,
                message: action.payload.message,
                title: action.payload.title,
                actionText: action.payload.actionText,
                actionOnClick: action.payload.actionOnClick,
            };
        case DISPATCH_MESSAGES.setInfoToast:
            return {
                hasErrorFullscreen: false,
                hasErrorToast: false,
                hasSuccessToast: false,
                hasInfoToast: true,
                message: action.payload.message,
                title: action.payload.title,
                actionText: action.payload.actionText,
                actionOnClick: action.payload.actionOnClick,
            };

        case DISPATCH_MESSAGES.clearFeedback:
            return {
                hasErrorFullscreen: false,
                hasErrorToast: false,
                hasSuccessToast: false,
                hasInfoToast: false,
                message: null,
                title: null,
                actionText: null,
                actionOnClick: () => null,
            };

        default:
            return state;
    }
};

interface IActionFeedbackState {
    hasErrorFullscreen: boolean;
    hasErrorToast: boolean;
    hasSuccessToast: boolean;
    hasInfoToast: boolean;
    message: string;
    title: string;
    actionText: string;
    actionOnClick: () => void;
}

export const initialState: IActionFeedbackState = {
    hasErrorFullscreen: false,
    hasErrorToast: false,
    hasSuccessToast: false,
    hasInfoToast: false,
    message: null,
    title: null,
    actionText: null,
    actionOnClick: () => null,
};
