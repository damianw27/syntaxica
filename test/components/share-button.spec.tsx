import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareButton } from '$components/share-button/share-button';
import fetchMock from 'jest-fetch-mock';

function mockFetchApi(url: string) {
  const shortenLinkResponse = { url };
  fetchMock.mockResponse(JSON.stringify(shortenLinkResponse));
}

describe('ShareButton', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.mockClear();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it('should render button label', () => {
    render(<ShareButton code="abc123" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveTextContent('Share');
  });

  it('should call shortenLink function and copy shortened URL to clipboard on button click', async () => {
    const clipboardMock = {
      writeText: jest.fn(() => Promise.resolve()),
    };

    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: { clipboard: clipboardMock },
    });

    const url = 'https://shorten.wilenskid.pl/abc';

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'https://example.com/?code=fdsaf23dfdas' },
    });

    mockFetchApi(url);
    render(<ShareButton code="abc123" />);

    const buttonElement = screen.getByRole('button');

    fireEvent.click(buttonElement);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(clipboardMock.writeText).toHaveBeenCalledWith(url));

    expect(screen.getByText('Copied!')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Copied!')).not.toBeInTheDocument());
  });

  it('should call shortenLink function and copy shortened URL to clipboard on button click', async () => {
    const clipboardMock = {
      writeText: jest.fn(() => Promise.resolve()),
    };

    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: { clipboard: clipboardMock },
    });

    const url = 'https://shorten.wilenskid.pl/abc';

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'https://example.com/' },
    });

    mockFetchApi(url);
    render(<ShareButton code="abc123" />);

    const buttonElement = screen.getByRole('button');

    fireEvent.click(buttonElement);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(clipboardMock.writeText).toHaveBeenCalledWith(url));

    expect(screen.getByText('Copied!')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Copied!')).not.toBeInTheDocument());
  });
});
