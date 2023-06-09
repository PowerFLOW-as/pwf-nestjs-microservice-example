import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { AppVersionInfoService } from '../src/base/services/app-version-info.service';
import { AppVersionInfoController } from '../src/base/controllers/app-version-info.controller';

describe('AppVersionInfoController', () => {
  let appVersionInfoService: AppVersionInfoService;
  let appVersionInfoController: AppVersionInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppVersionInfoService],
      controllers: [AppVersionInfoController],
      imports: [HttpModule],
    }).compile();

    appVersionInfoService = module.get<AppVersionInfoService>(AppVersionInfoService);
    appVersionInfoController = module.get<AppVersionInfoController>(AppVersionInfoController);
  });

  it('AppVersionInfoService - should be defined', () => {
    expect(appVersionInfoService).toBeDefined();
  });

  it('should return version info about app from service', () => {
    expect(appVersionInfoService.getVersionInfoJson()).not.toEqual(null);
  });

  it('should return version info about app from controller', () => {
    expect(appVersionInfoController.getVersionInfo()).not.toEqual(null);
  });
});
