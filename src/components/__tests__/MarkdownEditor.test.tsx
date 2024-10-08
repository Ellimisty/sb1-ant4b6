import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MarkdownEditor from '../MarkdownEditor';

describe('MarkdownEditor', () => {
  test('renders MarkdownEditor component', () => {
    render(<MarkdownEditor />);
    expect(screen.getByText('Markdown Editor')).toBeInTheDocument();
  });

  test('updates markdown content', () => {
    render(<MarkdownEditor />);
    const textarea = screen.getByPlaceholderText('Enter your markdown here...');
    fireEvent.change(textarea, { target: { value: '# Test Heading' } });
    expect(textarea).toHaveValue('# Test Heading');
  });
});