import worldCities from "@/data/worldcities.json";

const categories = ["Electronics", "Food", "Fashion", "Books"];

export const categoryOptions = categories.map((cat) => ({
  value: cat,
  label: cat,
}));

export const loadCityOptions = (inputValue, callback) => {
  if (!inputValue || inputValue.length < 2) {
    return callback([]);
  }

  const filtered = worldCities
    .filter((city) =>
      `${city.city}, ${city.country}`
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    )
    .slice(0, 20)
    .map((city) => ({
      label: `${city.city}, ${city.country}`,
      value: city.city,
      lat: city.lat,
      lng: city.lng,
    }));

  callback(filtered);
};

export const handleCityChange = (cities) => {
  setSelectedCities(cities || []);
};
