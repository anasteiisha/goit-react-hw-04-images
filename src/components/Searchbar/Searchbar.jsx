import { React } from 'react';
import * as s from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  const handleSubmit = e => {
    e.preventDefault();
    const value = e.target.elements.text.value;

    onSubmit(value);
  };

  return (
    <header>
      <s.SearchForm onSubmit={handleSubmit}>
        <s.SearchFormButton type="submit">
          <s.SearchFormLabel>Search</s.SearchFormLabel>
        </s.SearchFormButton>

        <s.SearchFormInput
          name="text"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </s.SearchForm>
    </header>
  );
};
