import { render, screen, act } from '@testing-library/react';
import { useIsMobile } from 'src/common/hooks/useMediaQueries';

import MedManagerLayout from '..';

import { mockNavigate } from 'src/setupTests';
import { client as apolloClient } from 'src/common/helpers/ApolloHelper';
import { ApolloProvider } from '@apollo/client';

beforeEach(() => {
    mockNavigate.mockReset();
});

describe('Med Manager desktop page', () => {
    beforeAll(() => {
        useIsMobile.mockReturnValue(false);
    });

    afterAll(() => {
        useIsMobile.mockReturnValue(true);
    });

    beforeEach(async () => {
        await act(async () => {
            render(
                <ApolloProvider client={apolloClient}>
                    <MedManagerLayout />
                </ApolloProvider>,
            );
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
    });

    test('includes All button on Desktop', async () => {
        const button = screen.queryByText('All');

        expect(button).toBeInTheDocument();
    });
    test('includes Refills button on Desktop', async () => {
        const button = screen.queryByText('Refills');

        expect(button).toBeInTheDocument();
    });
    test('includes Today button on Desktop', async () => {
        const button = screen.queryByText('Today');

        expect(button).toBeInTheDocument();
    });
});
