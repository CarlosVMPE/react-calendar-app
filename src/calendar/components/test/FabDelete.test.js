import { render, screen, fireEvent } from '@testing-library/react';
import { useCalendarStore } from '../../../hooks';
import { FabDelete } from '../FabDelete';

//* Mocks in hooks
jest.mock('../../../hooks/useCalendarStore');

describe('Testing in FabDelete', () => {

    const mockStartDeletingEvent = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('should be show the component correctly', () => {
        //* mockResolvedValue: para cosas asincronas o promesas
        useCalendarStore.mockReturnValue({
            hasEventSelected: false
        })

        render(<FabDelete />);
        //screen.debug();
        const btn = screen.getByLabelText('btn-delete');
        expect(btn.classList).toContain('btn');
        expect(btn.classList).toContain('btn-danger');
        expect(btn.classList).toContain('fab-danger');
        expect(btn.style.display).toBe('none');
    });

    test('should be show the button if theres is an active event', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true
        })

        render(<FabDelete />);
        const btn = screen.getByLabelText('btn-delete');
        expect(btn.style.display).toBe('');
    });

    test('should be call startDeletingEvent if there is an active event', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeletingEvent: mockStartDeletingEvent
        })

        render(<FabDelete />);
        const btn = screen.getByLabelText('btn-delete');
        fireEvent.click(btn);
        expect(mockStartDeletingEvent).toHaveBeenCalled();
    });
});