import React from "react";

const globalReducer = (state, action) => {
    console.log(action);
    console.log(state);
    switch (action.type) {
        case "DIALOG_PROMPT":
            return {
                ...state,
                dialogShown: action.dialogShown,
                dialogMessage: action.dialogMessage
            }
        default:
            return state;

    }

}

const initialState = {
    dialogShown: false,
    dialogMessage: ""
}

const GlobalContext = React.createContext({
    state: initialState,
    dispatch: () => {}
})

const GlobalStateProvider = ({children}) => {
    const [state, dispatch] = React.useReducer(globalReducer, initialState);
    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            {children}
        </GlobalContext.Provider>
    )

}

export default {GlobalContext: GlobalContext, GlobalStateProvider: GlobalStateProvider};