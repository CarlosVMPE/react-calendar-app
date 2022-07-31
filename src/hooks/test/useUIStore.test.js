import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react'
import { Provider } from 'react-redux';
import { uiSlice } from '../../store';
import { useUIStore } from '../useUIStore'

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
}

describe('Testing in useUIStore', () => {
    test('should be return the default values', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });
        const { result } = renderHook(() => useUIStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function)
        })
    });

    test('openDateModal should be set true in isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: false });
        const { result } = renderHook(() => useUIStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const { openDateModal } = result.current;
        act(() => {
            openDateModal()
        });


        expect(result.current.isDateModalOpen).toBeTruthy();
    });

    test('closeDateModal should be set false in isDateModalOpen', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });
        const { result } = renderHook(() => useUIStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        act(() => {
            result.current.closeDateModal();
        });

        expect(result.current.isDateModalOpen).toBeFalsy();
    });
    
    test('toggleDateModal should be change the state', () => {
        const mockStore = getMockStore({ isDateModalOpen: true });
        const { result } = renderHook(() => useUIStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        act(() => {
            result.current.toggleDateModal();
        });

        expect(result.current.isDateModalOpen).toBeFalsy();
        
        act(() => {
            result.current.toggleDateModal();
        });

        expect(result.current.isDateModalOpen).toBeTruthy();
    });


})