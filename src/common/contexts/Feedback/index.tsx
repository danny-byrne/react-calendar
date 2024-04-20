import React from 'react';
import { reducer, initialState } from './reducer';

export const FeedbackContext = React.createContext({
    state: initialState,
    // ESLint throws unused-var error because of dispatch type definition for single argument function
    /* eslint-disable-next-line*/
    dispatch: (input: object) => null,
});

interface IFeedbackProviderProps {
    children: JSX.Element | null;
}

export const FeedbackProvider: React.FC<IFeedbackProviderProps> = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    return <FeedbackContext.Provider value={{ state, dispatch }}>{children}</FeedbackContext.Provider>;
};
