'use client';

import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { Tooltip } from './Tooltip';

interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  tooltip?: string;
  error?: string;
  required?: boolean;
  id?: string;
}

/**
 * SearchableSelect component
 * Dropdown with search/filter capability - type to find options
 */
export function SearchableSelect({
  options,
  value,
  onChange,
  label,
  placeholder = 'Search...',
  tooltip,
  error,
  required,
  id,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  // Get the display value for selected option
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  // Filter and sort options based on search term
  // Prioritize: 1) Starts with search term, 2) Contains search term
  const filteredOptions = options
    .filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aLabel = a.label.toLowerCase();
      const bLabel = b.label.toLowerCase();
      const search = searchTerm.toLowerCase();

      const aStarts = aLabel.startsWith(search);
      const bStarts = bLabel.startsWith(search);

      // Both start with search term - sort alphabetically
      if (aStarts && bStarts) return aLabel.localeCompare(bLabel);
      // Only a starts with search term - a comes first
      if (aStarts) return -1;
      // Only b starts with search term - b comes first
      if (bStarts) return 1;
      // Neither starts with search term - sort alphabetically
      return aLabel.localeCompare(bLabel);
    });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
    setIsOpen(true);
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2"
        >
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
          {tooltip && (
            <Tooltip content={tooltip}>
              <svg
                className="w-4 h-4 text-foreground-muted hover:text-accent-purple transition-colors cursor-help"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Tooltip>
          )}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={cn(
            'w-full px-4 py-2.5 bg-background-elevated border rounded-lg text-foreground transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent',
            'placeholder:text-foreground-muted',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border hover:border-accent-purple/30'
          )}
          placeholder={placeholder}
          value={isOpen ? searchTerm : displayValue}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Dropdown icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className={cn(
              'w-5 h-5 text-foreground-muted transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-background-elevated border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  data-index={index}
                  className={cn(
                    'px-4 py-2.5 cursor-pointer transition-colors duration-150',
                    index === highlightedIndex
                      ? 'bg-accent-purple/20 text-accent-purple'
                      : 'text-foreground hover:bg-accent-purple/10',
                    value === option.value && 'font-medium text-accent-purple'
                  )}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-foreground-muted">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
