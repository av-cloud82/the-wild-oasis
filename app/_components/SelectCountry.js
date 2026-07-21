import { getCountries } from "@/app/_lib/data-service";

// Let's imagine your colleague already built this component 😃

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();

  const flag =
    countries.find(
      (country) =>
        country.names.common.toLowerCase() === defaultCountry?.toLowerCase(),
    )?.flag.url_png ?? "";

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries ? (
        countries.map((c) => (
          <option
            key={c.names.common}
            value={`${c.names.common}%${c.flag.url_png}`}
          >
            {c.names.common}
          </option>
        ))
      ) : (
        <option value={`Portugal`}>Portugal</option>
      )}
    </select>
  );
}

export default SelectCountry;
