import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { validParkingMock } from '../__mocks__/parking';
import { ParkingService } from './parking.service';
import { AlreadyParkedError } from './errors/already_parked.error';
import { ParkingNotFoundError } from './errors/parking_not_found.error';
import { ParkingNotPaidError } from './errors/parking_not_paid.error';
import { Parking } from './schemas/parking.schema';

describe('ParkingService', () => {
  let parkingService: ParkingService;

  function mockParkingModel() {
    /** */
  }
  mockParkingModel.prototype.save = jest.fn();
  mockParkingModel.find = jest.fn();
  mockParkingModel.findOne = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingService,
        {
          provide: getModelToken(Parking.name),
          useValue: mockParkingModel,
        },
      ],
    }).compile();

    parkingService = module.get<ParkingService>(ParkingService);
  });

  it('should create a new parking record', async () => {
    jest.spyOn(mockParkingModel, 'find').mockReturnValueOnce({
      sort: () => ({ limit: () => [] }),
    });
    jest
      .spyOn(mockParkingModel.prototype, 'save')
      .mockResolvedValueOnce(validParkingMock);

    const createdParking = await parkingService.create(validParkingMock);

    expect(createdParking).toEqual(validParkingMock);
  });

  it('should throw an error when already exists a record that is in the parking', async () => {
    jest.spyOn(mockParkingModel, 'find').mockReturnValueOnce({
      sort: () => ({ limit: () => [validParkingMock] }),
    });

    await expect(parkingService.create(validParkingMock)).rejects.toThrow(
      AlreadyParkedError,
    );
  });

  it('should return a sorted parking list', async () => {
    const lastParking = {
      ...validParkingMock,
      createdAt: validParkingMock.createdAt.getTime() + 1000,
    };

    jest.spyOn(mockParkingModel, 'find').mockReturnValueOnce({
      sort: () => [lastParking, validParkingMock],
    });

    const parkings = await parkingService.findByPlate(validParkingMock.plate);
    expect(parkings).toHaveLength(2);
    expect(parkings[0]).toEqual(lastParking);
  });

  it('should return a empty list when there are not parking tickets', async () => {
    jest.spyOn(mockParkingModel, 'find').mockReturnValueOnce({
      sort: () => [],
    });

    const parkings = await parkingService.findByPlate(validParkingMock.plate);
    expect(parkings).toHaveLength(0);
  });

  it('should update the paid field to true', async () => {
    jest
      .spyOn(mockParkingModel, 'findOne')
      .mockReturnValueOnce(validParkingMock);
    validParkingMock.save = jest.fn().mockReturnValueOnce(validParkingMock);

    const result = await parkingService.pay(validParkingMock.plate);

    expect(result.paid).toBeTruthy();
  });

  it('should throw an error when the parking record not exists', async () => {
    jest.spyOn(mockParkingModel, 'findOne').mockReturnValueOnce(null);

    await expect(parkingService.pay(validParkingMock.plate)).rejects.toThrow(
      ParkingNotFoundError,
    );
  });

  it('should update the left field to true when the parking is paid', async () => {
    jest
      .spyOn(mockParkingModel, 'findOne')
      .mockReturnValueOnce({ ...validParkingMock, paid: true });

    const result = await parkingService.getOut(validParkingMock.plate);

    await expect(result.left).toBeTruthy();
  });

  it('should throw an error when the parking record is not paid', async () => {
    jest
      .spyOn(mockParkingModel, 'findOne')
      .mockReturnValueOnce({ ...validParkingMock, paid: false });

    await expect(parkingService.getOut(validParkingMock.plate)).rejects.toThrow(
      ParkingNotPaidError,
    );
  });
});
