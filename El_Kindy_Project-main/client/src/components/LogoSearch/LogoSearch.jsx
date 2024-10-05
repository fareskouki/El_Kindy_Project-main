import React, { useState } from "react";
import './LogoSearch.css'
import { UilSearch } from '@iconscout/react-unicons'

const LogoSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    // Call the onSearch callback with the current search term
    onSearch(event.target.value);
  };

  return (
    <div className="Search">
      <input
        type="text"
        placeholder="Rechercher"
        value={searchTerm}
        onChange={handleChange}
      />
      <div className="s-icon">
        <UilSearch />
      </div>
    </div>
  );
};

export default LogoSearch;
