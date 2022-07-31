import { authenticatedState, initialState } from "../../fixtures/authStates"
import { testUserCredentials } from "../../fixtures/testUser";
import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from "./authSlice"

describe('Testing in authSlice', () => {
    test('should be return the default state', () => {
        expect(authSlice.getInitialState()).toEqual(initialState);
    });

    test('should be set the status in checking', () => {
        const state = authSlice.reducer(initialState, onChecking());
        expect(state).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined
        });
    });

    test('should be do the login', () => {
        const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        });
    });

    test('should be do the logout', () => {
        const state = authSlice.reducer(authenticatedState, onLogout());
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });
    })

    test('should be do the logout with errorMessage', () => {
        const errorMessage = 'Credenciales no válidas';
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessage
        });
    });

    test('should be clean the errorMessage', () => {
        const errorMessage = 'Credenciales no válidas';
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        const newState = authSlice.reducer(state, clearErrorMessage());
        expect(newState.errorMessage).toBe(undefined);
    })
})