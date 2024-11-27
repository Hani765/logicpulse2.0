type DomainType = {
  id: number,
  unique_id: string,
  user_id: string,
  name: string,
  created_at: string,
  updated_at: string,
  q: string;
  domain: [];
  length: string;
};
type NetworkType = {
  id: number,
  unique_id: string,
  user_id: string,
  name: string,
  tracker: string,
  created_at: string,
  updated_at: string,
  network: [];
  length: string;
};
type OfferType = {
  id: number,
  unique_id: string,
  user_id: string,
  offer_name: string,
  created_at: string,
  updated_at: string,
  network: [];
  length: string;
};
type TrackerType = {
  id: number,
  unique_id: string,
  name: string,
  created_at: string,
  updated_at: string,
  length: string;
};
type UserType = {
  id: number,
  unique_id: string,
  username: string,
  name: string,
  user_id: string,
  value: string,
  created_at: string,
  updated_at: string,
  user: [];
  length: string;
};
type CountryType = {
  id: number,
  name: string,
  unique_id: string,
  iso2: string,
};
type ApiResponseType<T> = {
  data: Array<T> | [];
}
