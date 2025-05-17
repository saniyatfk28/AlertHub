import { jest } from '@jest/globals';
import { createSos, getAllSosCalls, updateSosCallStatus } from '../Controllers/sosController.js';
import SosCall from '../Models/SosCall.js';

jest.mock('../Models/SosCall.js');

describe('sosController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSos', () => {
    it('should return 400 if callerName or location is missing', async () => {
      req.body = { callerName: '', location: '' };
      await createSos(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name and location are required' });
    });


    it('should error', async () => {
      req.body = {
        callerName: ' 99 ' ,
        phone: '1234567890',
        message: 'Help!',
        location: 'Test Location',
      };

      const saveMock = jest.fn().mockRejectedValue(new Error('DB error'));
      SosCall.mockImplementation(() => ({ save: saveMock }));

      await createSos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getAllSosCalls', () => {
    it('should return sos calls with status 200', async () => {
      const sosCallsMock = [{ id: 1 }, { id: 2 }];
      SosCall.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(sosCallsMock),
      });

      await getAllSosCalls(req, res);

      expect(SosCall.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(sosCallsMock);
    });

    it('should handle errors and return 500', async () => {
      SosCall.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      await getAllSosCalls(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateSosCallStatus', () => {
    it('should return 400 for invalid status', async () => {
      req.params = { id: '123' };
      req.body = { status: 'invalid' };

      await updateSosCallStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status value' });
    });

    it('should return 404 if sosCall not found', async () => {
      req.params = { id: '123' };
      req.body = { status: 'pending' };

      SosCall.findByIdAndUpdate.mockResolvedValue(null);

      await updateSosCallStatus(req, res);

      expect(SosCall.findByIdAndUpdate).toHaveBeenCalledWith('123', { status: 'pending' }, { new: true });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'SOS call not found' });
    });

    it('should update status and return 200 with sosCall', async () => {
      req.params = { id: '123' };
      req.body = { status: 'resolved' };

      const updatedSosCall = { id: '123', status: 'resolved' };
      SosCall.findByIdAndUpdate.mockResolvedValue(updatedSosCall);

      await updateSosCallStatus(req, res);

      expect(SosCall.findByIdAndUpdate).toHaveBeenCalledWith('123', { status: 'resolved' }, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Status updated', sosCall: updatedSosCall });
    });
  });
});
