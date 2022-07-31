import { fireEvent, render, screen } from "@testing-library/react";
import { calendarApi } from "../../api";
import { useAuthStore } from "../../hooks/useAuthStore";
import { LoginPage } from "./LoginPage";

//* Mocks in hooks
jest.mock('../../hooks/useAuthStore');

describe('Testing in LoginPage', () => {

    beforeEach(() => jest.clearAllMocks());

    const startLoginMock = jest.fn();
    const startRegisterMock = jest.fn();

    test('should be exist the modal error', () => {
        useAuthStore.mockReturnValue({
            startLogin: startLoginMock,
            startRegister: startRegisterMock,
            errorMessage: 'an error exist'
        });

        render(<LoginPage />);
        //screen.debug();
        expect(screen.getByText('Error en la autenticación')).toBeTruthy();
    });

    test('should be render the component correctly', () => {
        useAuthStore.mockReturnValue({
            startLogin: startLoginMock,
            startRegister: startRegisterMock,
            errorMessage: undefined
        });

        render(<LoginPage />);
        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(screen.getByText('Registro')).toBeTruthy();
    });

    test('should be startLogin with credentials', () => {
        useAuthStore.mockReturnValue({
            startLogin: startLoginMock,
            startRegister: startRegisterMock,
            errorMessage: undefined
        });

        render(<LoginPage />);

        const email = 'carlos123@gmail.com';
        const password = '123456';

        const emailField = screen.getByRole('textbox', { name: 'loginEmail' });
        fireEvent.change(emailField, { target: { name: 'loginEmail', value: email } });

        const loginPassword = screen.getByTestId('loginPassword')
        fireEvent.change(loginPassword, { target: { name: 'loginPassword', value: password } });

        const loginForm = screen.getByLabelText('login-form');
        fireEvent.submit(loginForm);

        expect(startLoginMock).toHaveBeenCalled();
    });

    test('should be not call startRegister when both passwords are not equal', () => {
        useAuthStore.mockReturnValue({
            startLogin: startLoginMock,
            startRegister: startRegisterMock,
            errorMessage: undefined
        });

        render(<LoginPage />);

        /* const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: 'ALGUN-ID',
                name: 'Test User',
                token: 'ALGUN-TOKEN'
            }
        }) */

        const email = 'test123@gmail.com';
        const password = '123456';
        const password2 = '1234567';

        const nameField = screen.getByRole('textbox', { name: 'registerName' });
        fireEvent.change(nameField, { target: { name: 'registerName', value: 'Test' } });
        
        const emailField = screen.getByRole('textbox', { name: 'registerEmail' });
        fireEvent.change(emailField, { target: { name: 'registerEmail', value: email } });

        const registerPassword = screen.getByTestId('registerPassword')
        fireEvent.change(registerPassword, { target: { name: 'registerPassword', value: password } });
        
        const registerPassword2 = screen.getByTestId('registerPassword2')
        fireEvent.change(registerPassword2, { target: { name: 'registerPassword2', value: password2 } });

        const registerForm = screen.getByLabelText('register-form');
        fireEvent.submit(registerForm);

        //spy.mockRestore(); //* Destroy the spy
        expect(startRegisterMock).not.toHaveBeenCalled();
    });
    
    test('should be call startRegister when both passwords are equal', () => {
        useAuthStore.mockReturnValue({
            startLogin: startLoginMock,
            startRegister: startRegisterMock,
            errorMessage: undefined
        });

        render(<LoginPage />);

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: 'ALGUN-ID',
                name: 'Test User',
                token: 'ALGUN-TOKEN'
            }
        })

        const email = 'test123@gmail.com';
        const password = '123456';
        const password2 = '123456';

        const nameField = screen.getByRole('textbox', { name: 'registerName' });
        fireEvent.change(nameField, { target: { name: 'registerName', value: 'Test' } });
        
        const emailField = screen.getByRole('textbox', { name: 'registerEmail' });
        fireEvent.change(emailField, { target: { name: 'registerEmail', value: email } });

        const registerPassword = screen.getByTestId('registerPassword')
        fireEvent.change(registerPassword, { target: { name: 'registerPassword', value: password } });
        
        const registerPassword2 = screen.getByTestId('registerPassword2')
        fireEvent.change(registerPassword2, { target: { name: 'registerPassword2', value: password2 } });

        const registerForm = screen.getByLabelText('register-form');
        fireEvent.submit(registerForm);

        spy.mockRestore(); //* Destroy the spy
        expect(startRegisterMock).toHaveBeenCalledWith({email, name: 'Test', password});
    });
})