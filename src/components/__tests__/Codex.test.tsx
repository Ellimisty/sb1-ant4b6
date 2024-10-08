import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Codex from '../Codex';

describe('Codex', () => {
  test('renders Codex component', () => {
    render(<Codex />);
    expect(screen.getByText('Codex')).toBeInTheDocument();
  });

  test('adds a new entry', () => {
    render(<Codex />);
    fireEvent.click(screen.getByText('Add New Entry'));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Entry' } });
    fireEvent.change(screen.getByPlaceholderText('Category'), { target: { value: 'Test Category' } });
    fireEvent.click(screen.getByText('Save Entry'));
    expect(screen.getByText('Test Entry')).toBeInTheDocument();
  });
});