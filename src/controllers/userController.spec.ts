import { UserController } from './userController';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Mock the logger module
jest.mock('../utils/logger', () => ({
    logger: jest.fn(),
}));

describe('UserController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockSend: jest.Mock;

    beforeEach(() => {
        mockSend = jest.fn();
        mockRequest = {};
        mockResponse = {
            send: mockSend,
        };
        
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should call logger and send "List of users"', async () => {
            // Act
            await UserController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(logger).toHaveBeenCalledWith('API endpoint /users was called...');
            expect(mockSend).toHaveBeenCalledWith('List of users');
        });

        it('should call logger exactly once', async () => {
            // Act
            await UserController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(logger).toHaveBeenCalledTimes(1);
        });

        it('should call res.send exactly once', async () => {
            // Act
            await UserController.getAll(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockSend).toHaveBeenCalledTimes(1);
        });
    });
});