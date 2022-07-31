import { getMessagesES } from "./getMessages"

describe('Testing in getMessagesES', () => {
    test('should be return an object', () => {
        const message = getMessagesES();
        const textMore = message.showMore('some-text');
        expect(message).toEqual({
            allDay: 'Todo el día',
            previous: '<',
            next: '>',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango',
            showMore: expect.any(Function)
        });
        expect(textMore).toBe('+ Ver más (some-text)');
    })
})