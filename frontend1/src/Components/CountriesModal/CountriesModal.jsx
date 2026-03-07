import React, { useEffect } from "react";
import "./countries.css";
import { Countries } from "../CountriesData.js";
import axios from "axios";

const CountriesModal = ({ onClose, onSelect }) => {


const getCountriesData = async ()=>{

    try {
        const res = await axios.get(`https://restcountries.com/v3.1/all?fields=name,flags,cca2`)
         
        console.log(res.data.flag.png)
    } catch (error) {
          console.log(error)
    }


}


useEffect(()=>{
     getCountriesData()
},[])

  return (
    <div className="country-overlay" onClick={onClose}>
      <div
        className="country-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Select Delivery Location</h3>

        <ul>
          {Countries.map((country) => (
            <li
              key={country.code}
              onClick={() => onSelect(country)}
            >
              <span className="flag">{country.flag}</span>
              <span className="name">{country.name}</span>
            </li>
          ))}
        </ul>

        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CountriesModal;
