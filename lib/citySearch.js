//lib/citySearch.js
import Fuse from 'fuse.js';
import cities from '@/data/worldcities.json';

const fuse = new Fuse(cities, {
  keys: ['city', 'country'],
  threshold: 0.3,
});

export const searchCities = (query) => {
  if (!query) return [];
  return fuse.search(query).slice(0, 10).map((result) => ({
    label: `${result.item.city}, ${result.item.country}`,
    lat: result.item.lat,
    lng: result.item.lng,
  }));
};
