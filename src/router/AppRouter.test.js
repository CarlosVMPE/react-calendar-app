import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CalendarPage } from '../calendar';
import { useAuthStore } from "../hooks/useAuthStore";
import { AppRouter } from "./AppRouter";

jest.mock('../hooks/useAuthStore');
//* MOCK del Componente
jest.mock('../calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}));

describe('Testing in AppRouter', () => {

    const mockCheckAuthToken = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('should be show the loading page and call checkAuthToken', () => {
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        })

        render(<AppRouter />);
        //screen.debug();

        expect(screen.getByText('Cargando...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();
    });

    test('should be show the loading page and call checkAuthToken', () => {
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        const { container } = render(
            <MemoryRouter initialEntries={['/auth2/algo/otracosa']}>
                <AppRouter />
            </MemoryRouter>
        );
        //screen.debug();
        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(container).toMatchSnapshot();
    });

    test('should be show the calendar page if we are authenticated', () => {
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        })

        render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );
        expect(screen.getByText('CalendarPage')).toBeTruthy();
    });


})