import { IFeedbackService } from '../FeedbackService';

const MOCK_TOAST_MESSAGE = 'Mock Message';
const MOCK_TOAST_TITLE = 'Mock Title';
const MOCK_TOAST_ACTIONTEXT = 'Mock Title';

export const useFeedbackService = (): IFeedbackService => {
    return {
        message: MOCK_TOAST_MESSAGE,
        title: MOCK_TOAST_TITLE,
        actionText: MOCK_TOAST_ACTIONTEXT,
        actionOnClick: () => null,
        hasErrorFullscreen: false,
        hasToast: false,
        hasErrorToast: false,
        hasSuccessToast: false,
        hasInfoToast: false,
        setErrorFullscreen: (message: string) => message,
        setErrorToast: (message: string) => message,
        setSuccessToast: (message: string) => message,
        setInfoToast: (message: string) => message,
        clearFeedback: () => null,
        clearErrorFullscreen: () => null,
    };
};
