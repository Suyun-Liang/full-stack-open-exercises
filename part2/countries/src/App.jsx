import axios from "axios";
import { useEffect, useState } from "react";
import Country from "./Country";
import Countries from "./Countries";

function App() {
  const [countries, setCountries] = useState(null);
  const [countryInput, setCountryInput] = useState("");
  const [expandedCountryName, setExpandedCountryName] = useState(null);
  const selectedCountries =
    countryInput.length > 0
      ? countries?.filter((country) => {
          const nameWithoutSpace = country.name.common
            .replaceAll(/\s/g, "")
            .toLowerCase();
          return nameWithoutSpace.includes(countryInput.toLowerCase());
        })
      : null;
  const singleMatchedCountry =
    selectedCountries?.length === 1 ? selectedCountries[0] : null;

  // console.log({ singleMatchedCountry });
  // console.log({ expandedCountryName });

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((res) => {
        setCountries(res.data);
      });
  }, []);

  return (
    <div>
      <div>
        <label htmlFor="country">find countries</label>
        <input
          id="country"
          value={countryInput}
          onChange={(e) => {
            setCountryInput(e.target.value);
            setExpandedCountryName(null);
          }}
        />
      </div>
      {singleMatchedCountry && (
        <Country country={singleMatchedCountry} directSearch={true} />
      )}
      {selectedCountries?.length > 1 && selectedCountries?.length <= 10 && (
        <Countries
          countries={selectedCountries}
          expandedCountryName={expandedCountryName}
          expandCountry={(countryName) => {
            setExpandedCountryName(
              countryName === expandedCountryName ? null : countryName,
            );
          }}
        />
      )}
      {selectedCountries?.length > 10 && <p>Too many matches</p>}
    </div>
  );
}

export default App;
