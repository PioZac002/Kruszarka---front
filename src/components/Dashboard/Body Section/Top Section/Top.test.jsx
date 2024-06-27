// Top.test.jsx
import { render, screen } from '@testing-library/react';
import Top from '../Top';

describe('Top Component', () => {
  test('renders Top component', () => {
    render(<Top />);
    const headerElement = screen.getByText(/Zarzadzaj kruszarkami bla bla/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders Explore more button', () => {
    render(<Top />);
    const buttonElement = screen.getByText(/Explore more/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders Moje kruszarki button', () => {
    render(<Top />);
    const buttonElement = screen.getByText(/Moje kruszarki/i);
    expect(buttonElement).toBeInTheDocument();
  });
});
