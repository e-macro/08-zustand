import css from './SearchBox.module.css'
// import type { DebouncedState } from 'use-debounce';
import type { ChangeEvent } from 'react';

interface SearchBoxProps {
    searchQuery: string;
    // updatedSearchQuery: string;
    onUpdate: (e: ChangeEvent<HTMLInputElement>) => void;
}
export default function SearchBox( { searchQuery, onUpdate }: SearchBoxProps ) {  
    return (<input
  className={css.input}
  value={searchQuery}
  type="text"
  placeholder="Search notes"
  onChange={onUpdate}
 />
)
}