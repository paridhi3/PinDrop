import worldCities from "@/data/worldcities.json";

export const categories = [
  "Electronics",
  "Food",
  "Fashion",
  "Books",
  "Home & Furniture",
  "Health & Wellness",
  "Beauty & Personal Care",
  "Grocery",
  "Automotive",
  "Jewelry",
  "Toys & Games",
  "Sports & Outdoors",
  "Pet Supplies",
  "Office Supplies",
  "Art & Craft",
  "Mobile & Accessories",
  "Travel & Tourism",
  "Real Estate",
  "Education",
  "Entertainment",
  "Fitness",
  "Pharmacy",
  "Hardware & Tools",
  "Baking & Confectionery",
  "Photography",
  "Event Planning",
  "Cleaning Services",
  "Laundry Services",
  "Gardening & Landscaping"
];

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

// export const handleCityChange = (cities) => {
//   setSelectedCities(cities || []);
// };
export const handleCityChange = (setSelectedCities) => (cities) => {
  setSelectedCities(cities || []);
};

