
export const initialState = {
    status: 'cheking', // 'authenticated', 'not-authenticated' 
    user: {},
    errorMessage: undefined
}

export const authenticatedState = {
    status: 'authenticated', // 'authenticated', 'not-authenticated' 
    user: {
        uid: 'abc',
        name: 'Carlos'
    },
    errorMessage: undefined
}

export const notAuthenticatedState = {
    status: 'not-authenticated', // 'authenticated', 'not-authenticated' 
    user: {},
    errorMessage: undefined
}