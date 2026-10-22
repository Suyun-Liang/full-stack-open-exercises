import Country from "./Country";

function Countries({ countries, expandedCountryName, expandCountry }) {
  return (
    <div>
      {countries.map((country) => {
        const name = country.name.common;

        return (
          <div key={name}>
            {name}{" "}
            <button onClick={() => expandCountry(name)}>
              {expandedCountryName === name ? "hide" : "show"}
            </button>
            {expandedCountryName === name && <Country country={country} />}
          </div>
        );
      })}
    </div>
  );
}

export default Countries;
