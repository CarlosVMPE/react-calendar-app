import calendarApi from "./calendarApi"

describe('Testing in calendarApi', () => {
    test('should be have a default config', () => {
        //console.log(calendarApi);
        expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL)
    });

    test('should be have the x-token in headers in every call http', async () => {
        localStorage.setItem('token', 'ABC-123-XYZ');
        const res = await calendarApi.get('/auth');
        expect(res.config.headers['x-token']).toBe('ABC-123-XYZ');
    });
})