import { useContext } from 'react';
import { FeedbackContext } from 'src/common/contexts/Feedback';
import { DISPATCH_MESSAGES } from 'src/common/contexts/Feedback/reducer';

export interface IFeedbackService {
    message: string;
    title: string;
    actionText: string;
    actionOnClick: () => void;
    hasErrorFullscreen: boolean;
    hasToast: boolean;
    hasErrorToast: boolean;
    hasSuccessToast: boolean;
    hasInfoToast: boolean;
    setErrorFullscreen: (message: string) => void;
    setErrorToast: (message: string, title?: string, actionText?: string, actionOnClick?: () => void) => void;
    setSuccessToast: (message: string, title?: string, actionText?: string, actionOnClick?: () => void) => void;
    setInfoToast: (message: string, title?: string, actionText?: string, actionOnClick?: () => void) => void;
    clearFeedback: () => void;
    clearErrorFullscreen: () => void;
}

export const useFeedbackService = (): IFeedbackService => {
    const { state, dispatch } = useContext(FeedbackContext);

    return {
        message: state.message,
        title: state.title,
        actionText: state.actionText,
        actionOnClick: state.actionOnClick,
        hasErrorFullscreen: state.hasErrorFullscreen,
        hasToast: state.hasErrorToast || state.hasSuccessToast || state.hasInfoToast,
        hasErrorToast: state.hasErrorToast,
        hasSuccessToast: state.hasSuccessToast,
        hasInfoToast: state.hasInfoToast,
        setErrorFullscreen: (message: string) =>
            dispatch({ type: DISPATCH_MESSAGES.setErrorFullscreen, payload: { message: message } }),
        clearErrorFullscreen: () => dispatch({ type: DISPATCH_MESSAGES.clearErrorFullscreen }),
        setErrorToast: (message: string, title?: string, actionText?: string, actionOnClick?: () => void) =>
            dispatch({
                type: DISPATCH_MESSAGES.setErrorToast,
                payload: { ...{ message, title, actionText, actionOnClick } },
            }),
        setSuccessToast: (message: string, title?: string, actionText?: string, actionOnClick?: () => void) =>
            dispatch({
                type: DISPATCH_MESSAGES.setSuccessToast,
                payload: { ...{ message, title, actionText, actionOnClick } },
            }),
        setInfoToast: (message: string, title?: string, actionText?: string, actionOnClick?: () => void) =>
            dispatch({
                type: DISPATCH_MESSAGES.setInfoToast,
                payload: { ...{ message, title, actionText, actionOnClick } },
            }),
        clearFeedback: () => dispatch({ type: DISPATCH_MESSAGES.clearFeedback }),
    };
};
