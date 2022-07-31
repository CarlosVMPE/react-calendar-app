import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from '@testing-library/react'
import { Provider } from "react-redux"
import { calendarApi } from "../../api"
import { initialState, notAuthenticatedState } from "../../fixtures/authStates"
import { testUserCredentials } from "../../fixtures/testUser"
import { authSlice } from "../../store"
import { useAuthStore } from "../useAuthStore"

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}

describe('Testing in useAuthStore', () => {

    beforeEach(() => localStorage.clear());

    test('should return the default values', () => {
        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        expect(result.current).toEqual({
            status: 'cheking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function)
        })
    });

    test('should be do the login correctly', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        await act(async () => {
            await result.current.startLogin(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test', uid: '62de15e0638c4e673026880d' }
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String))
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))
    });

    test('startLogin should be fail the autentication', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        await act(async () => {
            await result.current.startLogin({ email: 'algo@google.com', password: '123123' });
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        })
        expect(localStorage.getItem('token')).toBeNull();

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );
    });

    test('startRegister should create an user', async () => {
        const newUser = { email: 'algo@google.com', password: '123123', name: 'Test User 2' };
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: 'ALGUN-ID',
                name: 'Test User',
                token: 'ALGUN-TOKEN'
            }
        })

        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: 'ALGUN-ID' }
        });

        spy.mockRestore(); //* Destroy the spy
    });

    test('startRegister should be fail when try to create an user', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        await act(async () => {
            await result.current.startRegister(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Usuario ya existe.',
            status: 'not-authenticated',
            user: {}
        });
    });

    test('startRegister should be fail when try to create an user and not return a message', async () => {
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        await act(async () => {
            await result.current.startRegister({
                email: 'test@google.com',
                password: '123123',
                uid: '62de15e0638c4e673026880d'
            });
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: '--',
            status: 'not-authenticated',
            user: {}
        });
    });

    test('checkAuthToken should be fail if there is no token', async () => {
        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })
    });

    test('checkAuthToken should be authenticate the user if there is a token', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test', uid: '62de15e0638c4e673026880d' }
        })
    });


    test('checkAuthToken should be clear the localStorage and logout when catch an error', async () => {

        localStorage.setItem('token', 'ANY-TOKEN');
        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({ ...notAuthenticatedState });
    });


    test('should be clear the storage and store values', () => {
        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook(() => useAuthStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        act(() => {
            result.current.startLogout();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual(
            {
                errorMessage: undefined,
                status: 'not-authenticated',
                user: {}
            }
        )
    })
})