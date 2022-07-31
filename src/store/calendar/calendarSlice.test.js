import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";
import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "./calendarSlice"

describe('Testing in calendarSlice', () => {
    test('should be return the default state', () => {
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);
    });

    test('onSetActiveEvent should be active the event ', () => {
        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));
        expect(state.activeEvent).toEqual(events[0]);
    });

    test('onAddNewEvent should be add the event', () => {
        const newEvent = {
            id: '3',
            start: "2022-09-22T13:30:00.675Z",
            end: "2022-09-22T15:30:00.675Z",
            title: 'Birthday of Belu',
            notes: 'Something here'
        };

        const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));
        expect(state.events).toEqual([...events, newEvent]);
    })

    test('onUpdateEvent should be update the event', () => {
        const updatedEvent = {
            id: '1',
            start: "2022-09-22T13:30:00.675Z",
            end: "2022-09-22T15:30:00.675Z",
            title: 'Birthday of Belucito !!',
            notes: 'Something here updated'
        };

        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updatedEvent));
        expect(state.events).toContain(updatedEvent)
    });

    test('should be delete the active event', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());
        expect(state.activeEvent).toBeNull();
        expect(state.events).not.toContain(events[0]);
        const newState = calendarSlice.reducer(initialState, onDeleteEvent());
        expect(state.activeEvent).toBeNull();
    })
    test('should be init the events', () => {
        const newEvents = [
            {
                id: '3',
                start: new Date('2022-07-29 13:00:00'),
                end: new Date('2022-07-29 14:00:00'),
                title: 'Something different in the day',
                notes: 'Something here'
            }
        ];

        const state = calendarSlice.reducer(initialState, onLoadEvents(newEvents));;
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events).toContain(newEvents[0]);
        const newState = calendarSlice.reducer(state, onLoadEvents(newEvents));
        expect(newState.events.length).toBe(state.events.length);
    })

    test('onLogoutCalendar should be clear the state', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());
        expect(state).toEqual({
            isLoadingEvents: true,
            events: [],
            activeEvent: null
        })
    })
})