// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { fetchConfig } from './FetchConfig';

let fetchBackup: any = undefined;

beforeEach(() => {
  fetchBackup = global.fetch;
});

afterEach(() => {
  global.fetch = fetchBackup;
});

describe('FetchConfig', () => {
  test('Should return config if everything is successful', async () => {
    const mockConfig = {
      microsoftBookingsUrl: 'https://url',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Company',
      colorPalette: '#FFFFFF',
      waitingTitle: 'title',
      waitingSubtitle: 'subtitle'
    };

    global.fetch = jest.fn(
      (_: RequestInfo, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 200,
          text: () => Promise.resolve(JSON.stringify(mockConfig))
        } as Response);
      }
    );

    const fetchedConfig = await fetchConfig();

    expect(fetchedConfig).toBeDefined();
    expect(fetchedConfig?.microsoftBookingsUrl).toBe(mockConfig.microsoftBookingsUrl);
    expect(fetchedConfig?.chatEnabled).toBe(mockConfig.chatEnabled);
    expect(fetchedConfig?.screenShareEnabled).toBe(mockConfig.screenShareEnabled);
    expect(fetchedConfig?.companyName).toBe(mockConfig.companyName);
    expect(fetchedConfig?.waitingTitle).toBe(mockConfig.waitingTitle);
    expect(fetchedConfig?.theme).toBeDefined();
    expect(fetchedConfig?.waitingSubtitle).toBe(mockConfig.waitingSubtitle);
  });

  test('Should return undefined if status code is not 200', async () => {
    const mockConfig = {
      microsoftBookingsUrl: 'https://url',
      chatEnabled: true,
      screenShareEnabled: true,
      companyName: 'Company',
      colorPalette: '#FFFFFF',
      waitingTitle: 'title',
      waitingSubtitle: 'subtitle'
    };

    global.fetch = jest.fn(
      (_: RequestInfo, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 500,
          json: () => Promise.resolve(mockConfig)
        } as Response);
      }
    );

    let gotError = false;
    try {
      await fetchConfig();
    } catch (error) {
      gotError = true;
    }

    expect(gotError).toBeTruthy();
  });

  test('Should return undefined if there is no valid json response', async () => {
    global.fetch = jest.fn(
      (_: RequestInfo, __?: RequestInit | undefined): Promise<Response> => {
        return Promise.resolve<Response>({
          status: 200,
          json: () => Promise.resolve(undefined)
        } as Response);
      }
    );

    let gotError = false;
    try {
      await fetchConfig();
    } catch (error) {
      gotError = true;
    }

    expect(gotError).toBeTruthy();
  });
});
