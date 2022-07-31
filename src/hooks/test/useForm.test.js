import { act, renderHook } from "@testing-library/react";
import { useForm } from "../useForm";

const formValidations = {
    email: [ (value) => value.includes('@'), 'El correo debe de tener un @'],
    password: [ (value) => value.length >= 6, 'El password debe de tener más de 6 letras.']
  };

describe('Testing in hook useForm', () => {

    const initialForm = {
        name: 'Carlos',
        password: '1234567',
        email: 'carlos@google.com'
    };

    test('should be return an empty object', () => {
        const { result } = renderHook(() => useForm());
        expect(result.current).toEqual({
            formState: {},
            onInputChange: expect.any(Function),
            onResetForm: expect.any(Function),
            isFormValid: true
        });
    })

    test('should be return the object default', () => {
        const { result } = renderHook(() => useForm(initialForm));
        expect(result.current).toEqual({
            name: initialForm.name,
            email: initialForm.email,
            password: '1234567',
            formState: initialForm,
            onInputChange: expect.any(Function),
            onResetForm: expect.any(Function),
            isFormValid: true
        });
    });

    test('should change the name of the form', () => {
        const newValue = 'Juan';
        const { result } = renderHook(() => useForm(initialForm));
        const { onInputChange } = result.current;

        // montar el hook
        // onInputChange // act, event...
        act(() => {
            onInputChange({
                target: {
                    name: 'name',
                    value: newValue
                }
            })
        });


        // expect, result.current.name === Juan
        // expect, result.current.formState.name === Juan
        expect(result.current.name).toBe(newValue);
        expect(result.current.formState.name).toBe(newValue);
    });

    test('should reset the form', () => {
        const newValue = 'Juan';
        const { result } = renderHook(() => useForm(initialForm));
        const { onInputChange, onResetForm } = result.current;

        // montar el hook
        // onInputChange // act, event...
        act(() => {
            onInputChange({
                target: {
                    name: 'name',
                    value: newValue
                }
            });
            onResetForm();
        });

        // expect, result.current.name === Juan
        // expect, result.current.formState.name === Juan
        expect(result.current.name).toBe(initialForm.name);
        expect(result.current.formState.name).toBe(initialForm.name);
    });

    test('should be return false when have a error value', () => {
        const initError = {
            name: 'Carlos',
            password: '1234567',
            email: 'carlosgoogle.com'
        };
        const { result } = renderHook(() => useForm(initError, formValidations));
        expect(result.current.isFormValid).toBeFalsy();
    });
    
    test('should be not return false when have a error value', () => {
        const { result } = renderHook(() => useForm(initialForm, formValidations));
        expect(result.current.isFormValid).toBeTruthy();
    });
});