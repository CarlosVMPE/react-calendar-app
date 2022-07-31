
export const events = [
    {
        id: '1',
        start: "2022-07-26T13:30:00.675Z",
        end: "2022-07-27T15:30:00.675Z",
        title: 'Birthday of Carlos',
        notes: 'Something here'
    },
    {
        id: '2',
        start: "2022-10-21T13:30:00.675Z",
        end: "2022-10-21T15:30:00.675Z",
        title: 'Birthday of Calin',
        notes: 'Something here'
    }
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: { ...events[0] }
}

export const calendarWithNotExistEvent = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent:
    {
        id: '3',
        start: "2022-10-21T13:30:00.675Z",
        end: "2022-10-21T15:30:00.675Z",
        title: 'SOME-TITLE',
        notes: 'Something here'
    }
}

