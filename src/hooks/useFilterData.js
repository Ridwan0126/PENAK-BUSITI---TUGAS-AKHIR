import {
  DUMMY_CITIES,
  DUMMY_MANAGERS,
  SERVICE_CATEGORIES,
} from "../constants/filterData";

export const useFilterData = () => {
  return {
    cities: DUMMY_CITIES,
    managers: DUMMY_MANAGERS,
    services: SERVICE_CATEGORIES,
    loading: false,
    status: "all",
    error: null,
  };
};
