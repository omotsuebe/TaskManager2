import { render, screen, waitFor } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import HomePage from '~/routes/_index';
import { describe, expect, it } from 'vitest';
import { userEvent } from '@testing-library/user-event';

describe('Home Page', () => {
    const user = userEvent.setup();
    const RemixStub = createRemixStub([
        {
            path: '/',
            Component: HomePage,
            loader() {
                return null;
            },
        },
    ]);
    render(<RemixStub />);


    it('should render the logo', async () => {
        expect(screen.getByAltText('')).toBeInTheDocument();
    });

});