
import { jest } from '@jest/globals';

// Define mocks before imports
const mockTicketInstance = {
    save: jest.fn(),
    populate: jest.fn(),
    deleteOne: jest.fn(),
    attachments: [],
    comments: {
        push: jest.fn(),
        id: jest.fn(),
    },
    created_by: { _id: { equals: jest.fn() } },
    assigned_to: { _id: { equals: jest.fn() } },
};

const MockTicket = jest.fn(() => mockTicketInstance);
MockTicket.find = jest.fn();
MockTicket.findById = jest.fn();
MockTicket.findByIdAndUpdate = jest.fn();

const mockDepartmentInstance = {
    save: jest.fn(),
    populate: jest.fn(),
    users: [],
};
const MockDepartment = jest.fn(() => mockDepartmentInstance);
MockDepartment.findById = jest.fn();

const mockAssignmentAlgorithms = {
    leastRecentlyAssigned: jest.fn(),
    loadBalancing: jest.fn(),
    roundRobin: jest.fn(),
};

// Mock modules
jest.unstable_mockModule('../models/ticket.model.js', () => ({
    default: MockTicket,
}));

jest.unstable_mockModule('../models/department.model.js', () => ({
    default: MockDepartment,
}));

jest.unstable_mockModule('../utils/assignmentAlgorithms.js', () => mockAssignmentAlgorithms);

jest.unstable_mockModule('fs', () => ({
    default: {
        existsSync: jest.fn(),
        unlinkSync: jest.fn(),
    }
}));

// Import service
const {
    createTicketService,
    getTicketsService,
    updateTicketStatusService,
    addCommentService
} = await import('../services/ticket.service.js');

describe('Ticket Service', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset instance methods if needed
        mockTicketInstance.save.mockReset();
        mockTicketInstance.populate.mockReset();
        MockTicket.find.mockReset();
        MockTicket.findById.mockReset();
        MockTicket.findByIdAndUpdate.mockReset();
    });

    describe('createTicketService', () => {
        it('should create and save a new ticket', async () => {
            const data = { title: 'New Ticket' };
            const userId = 'user1';
            const baseUrl = 'http://test.com';

            const result = await createTicketService(data, userId, null, baseUrl);

            expect(MockTicket).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Ticket',
                created_by: 'user1'
            }));
            expect(mockTicketInstance.save).toHaveBeenCalled();
            expect(mockTicketInstance.populate).toHaveBeenCalledWith('created_by', 'name email');
            expect(result).toBe(mockTicketInstance);
        });
    });

    describe('updateTicketStatusService', () => {
        it('should update status if valid', async () => {
            const ticketId = 't1';
            const status = 'In Progress';
            const userId = 'u1';
            const role = 'admin';

            MockTicket.findByIdAndUpdate.mockResolvedValue(mockTicketInstance);

            const result = await updateTicketStatusService(ticketId, status, userId, role);

            expect(MockTicket.findByIdAndUpdate).toHaveBeenCalledWith(
                ticketId,
                { status },
                { new: true }
            );
            expect(result).toBe(mockTicketInstance);
        });

        it('should throw error if invalid status', async () => {
            await expect(updateTicketStatusService('t1', 'BadStatus', 'u1', 'admin'))
                .rejects.toThrow('Invalid status');
        });

        it('should throw error if unauthorized', async () => {
            await expect(updateTicketStatusService('t1', 'Open', 'u1', 'user'))
                .rejects.toThrow('Unauthorized');
        });
    });

    describe('addCommentService', () => {
        it('should add a comment to ticket', async () => {
            const ticketId = 't1';
            const text = 'Some comment';
            const userId = 'u1';

            MockTicket.findById.mockResolvedValue(mockTicketInstance);
            mockTicketInstance.comments.push.mockImplementation((comment) => {
                // verify comment structure if needed
            });

            await addCommentService(ticketId, text, null, userId);

            expect(MockTicket.findById).toHaveBeenCalledWith(ticketId);
            expect(mockTicketInstance.comments.push).toHaveBeenCalled();
            expect(mockTicketInstance.save).toHaveBeenCalled();
        });

        it('should throw error for empty comment', async () => {
            await expect(addCommentService('t1', '', null, 'u1'))
                .rejects.toThrow('Comment cannot be empty');
        });
    });

});
