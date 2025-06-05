const DOMAIN = "google_pollen";
const ATTR_TODAY = "state_today";
const ATTR_TOMORROW = "state_tomorrow";
const ATTR_IN_2_DAYS = "state_in_2_days";

export const stubConfigGooglePollen = {
  integration: "google_pollen",
  allergens: [
    "hazel",
    "alder",
    "ash",
    "birch",
    "cottonwood",
    "oak",
    "olive",
    "pine",
    "grass",
    "grasses",
    "ragweed",
    "mugwort",
    "weed",
    "tree",
  ],
  minimal: false,
  show_text_allergen: true,
  show_value_text: true,
  show_value_numeric: false,
  show_value_numeric_in_circle: false,
  show_empty_days: true,
  debug: false,
  days_to_show: 3,
  days_relative: true,
  days_abbreviated: false,
  days_uppercase: false,
  days_boldfaced: false,
  pollen_threshold: 1,
  sort: "value_descending",
  allergens_abbreviated: false,
  date_locale: undefined,
  title: undefined,
  phrases: { full: {}, short: {}, levels: [], days: {}, no_information: "" },
};

export async function fetchForecast(hass, config = stubConfigGooglePollen) {
  const debug = Boolean(config.debug);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allergens = config.allergens || stubConfigGooglePollen.allergens;
  const sensors = [];

  for (const allergen of allergens) {
    try {
      const sensorId = `sensor.google_pollen_${allergen}`;
      if (!hass.states[sensorId]) continue;

      const sensor = hass.states[sensorId];

      const pollenData = {
        allergen: allergen.charAt(0).toUpperCase() + allergen.slice(1),
        today: Number(sensor.state) || -1,
        tomorrow: Number(sensor.attributes[ATTR_TOMORROW]) || -1,
        in_2_days: Number(sensor.attributes[ATTR_IN_2_DAYS]) || -1,
      };

      sensors.push(pollenData);
    } catch (error) {
      console.warn(`Google Pollen error for ${allergen}:`, error);
    }
  }

  sensors.sort(
    config.sort === "name_descending"
      ? (a, b) => b.allergen.localeCompare(a.allergen)
      : (a, b) => b.today - a.today
  );

  if (debug) console.debug("Google Pollen adapter complete:", sensors);
  return sensors;
}
