import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook } from "@testing-library/react"
import { Provider } from "react-redux"
import { calendarApi } from "../../api"
import { calendarWithActiveEventState, calendarWithEventsState, calendarWithNotExistEvent, events, initialState } from "../../fixtures/calendarStates"
import { testUserCredentials } from "../../fixtures/testUser"
import { authSlice, calendarSlice } from "../../store"
import { useCalendarStore } from "../useCalendarStore"

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
            calendar: calendarSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState },
            calendar: { ...initialState }
        }
    })
}

describe('Testing in useCalendarStore', () => {
    test('should return the default values', () => {
        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        expect(result.current).toEqual({
            events: [],
            activeEvent: null,
            hasEventSelected: false,
            setActiveEvent: expect.any(Function),
            startSavingEvent: expect.any(Function),
            startDeletingEvent: expect.any(Function),
            startLoadingEvents: expect.any(Function)
        })
    });

    test('should be set the active event', () => {
        const mockStore = getMockStore({ ...calendarWithEventsState });

        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        act(() => {
            result.current.setActiveEvent(events[0]);
        });

        const { activeEvent } = result.current;
        expect(activeEvent).toEqual(events[0]);

    });

    test('should be create a new event', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);
        const newEvent = {
            start: "2022-10-30T13:22:00.675Z",
            end: "2022-10-30T15:23:00.675Z",
            title: 'This is a new event',
            notes: 'Something here'
        };
        const mockStore = getMockStore({ ...calendarWithEventsState });
        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                evento: {
                    title: "TITLE-EVENT",
                    start: "START-DATE",
                    end: "END-DATE",
                    user: "ID-USER",
                    id: "ID-EVENT"
                }
            }
        })

        await act(async () => {
            await result.current.startSavingEvent(newEvent);
        });

        expect(result.current.events.length).toBe(3)

        spy.mockRestore(); //* Destroy the spy
    });

    test('should be update an exist event', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);
        const existEvent = {
            id: '2',
            start: "2022-10-21T13:30:00.675Z",
            end: "2022-10-21T15:30:00.675Z",
            title: 'Birthday of Rat Calin',
            notes: 'Something here'
        };
        const mockStore = getMockStore({ ...calendarWithEventsState });
        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        const spy = jest.spyOn(calendarApi, 'put').mockReturnValue({
            data: {
                ok: true,
                evento: {
                    title: 'Birthday of Rat Calin',
                    start: "2022-10-21T13:30:00.675Z",
                    end: "2022-10-21T15:30:00.675Z",
                    user: 'ID-USER',
                    id: '2'
                }
            }
        })

        await act(async () => {
            await result.current.startSavingEvent(existEvent);
        });

        existEvent.title = 'Birthday of Rat Calin';
        expect(result.current.events).toContainEqual(existEvent);

        spy.mockRestore(); //* Destroy the spy
    });

    test('should be show an error in startSavingEvent', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);
        const existEvent = {};
        const mockStore = getMockStore({ ...calendarWithEventsState });
        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        await act(async () => {
            await result.current.startSavingEvent(existEvent);
        });

        expect(result.current.events.length).toBe(2);
    });

    test('should be delete the activeEvent', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...calendarWithActiveEventState });
        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        const spy = jest.spyOn(calendarApi, 'delete').mockReturnValue({
            data: {
                ok: true
            }
        })

        await act(async () => {
            await result.current.startDeletingEvent();
        });

        expect(result.current.events.length).toBe(1);
        spy.mockRestore(); //* Destroy the spy
    });

    test('should not delete the activeEvent', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...calendarWithEventsState });
        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );


        await act(async () => {
            await result.current.startDeletingEvent();
        });

        expect(result.current.events.length).toBe(2);
    });

    test('should not delete the activeEvent - ERROR', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...calendarWithNotExistEvent });
        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );


        await act(async () => {
            await result.current.startDeletingEvent();
        });

        expect(result.current.events.length).toBe(2);
    });

    test('should be load all the events', async () => {
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        const spy = jest.spyOn(calendarApi, 'get').mockReturnValue({
            data: {
                ok: true,
                eventos: [
                    {
                        id: '2',
                        start: "2022-10-21T13:30:00.675Z",
                        end: "2022-10-21T15:30:00.675Z",
                        title: 'Birthday of Calin',
                        notes: 'Something here'
                    }
                ]
            }
        })

        await act(async () => {
            await result.current.startLoadingEvents();
        });

        expect(result.current.events.length).toBe(1);

        spy.mockRestore(); //* Destroy the spy
    });

    test('should be not load all the events', async () => {
        /* const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token); */

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useCalendarStore(),
            {
                wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
            }
        );

        const spy = jest.spyOn(calendarApi, 'get').mockReturnValue({
            data: {
                ok: false,
                eventos: null
            }
        })

        await act(async () => {
            await result.current.startLoadingEvents();
        });

        expect(result.current.events).toEqual([]);

        spy.mockRestore(); //* Destroy the spy
    });

})