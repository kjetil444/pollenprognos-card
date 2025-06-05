const DOMAIN = "google_pollen";
const ATTR_TODAY = "state_today";
const ATTR_TOMORROW = "state_tomorrow";
const ATTR_IN_2_DAYS = "state_in_2_days";

export async function fetchForecast(hass, config) {
  const debug = Boolean(config.debug);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allergens = ["tree", "grass", "weed"];
  const sensors = [];

  for (const allergen of allergens) {
    try {
      const sensorId = `sensor.google_pollen_${allergen}`;
      if (!hass.states[sensorId]) continue;
      
      const sensor = hass.states[sensorId];

      const pollenData = {
        allergen: allergen.charAt(0).toUpperCase() + allergen.slice(1),
        today: sensor.state,
        tomorrow: sensor.attributes[ATTR_TOMORROW] || -1,
        in_2_days: sensor.attributes[ATTR_IN_2_DAYS] || -1
      };

      sensors.push(pollenData);
    } catch (error) {
      console.warn(`Google Pollen error for ${allergen}:`, error);
    }
  }

  if (debug) console.debug("Google Pollen adapter complete:", sensors);
  return sensors;
}
