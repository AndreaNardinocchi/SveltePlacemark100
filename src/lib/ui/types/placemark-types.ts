export interface Session {
  email: string;
  name: string;
  _id: string;
  token: string;
}

export interface User {
  firstName: string;
  lastName: string;
  userLat: string;
  userLong: string;
  country: string;
  street: string;
  addressCode: string;
  DOB: string;
  phoneNumber: string;
  email: string;
  password: string;
  createdTimeStamp: string;
  _id: string;
}

export interface Category {
  _id: string;
  //  _id: any;
  // thisUserCategory: Placemark;
  // thisUserCategory: Placemark[];
  placemarks: Placemark[];
  // placemarks?: Placemark[];
  title: string;
  notes: string;
  // img: string;
  image: string;
  userid: User | string;
  // _id?: string;
}

export interface Placemark {
  //categoryId: string;
  category: Category | string;
  title: string;
  lat: string;
  long: string;
  address: string;
  country: string;
  phone: string;
  website: string;
  visited: string;
  description: string;
  // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays
  img?: string[]; // img is optional and can be undefined
  _id?: string;
}

export interface DataSet {
  labels: string[];
  datasets: [{ values: number[] }];
}

export interface PlacemarkService {
  signup(user: User): Promise<boolean>;
  login(email: string, password: string): Promise<Session | null>;

  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;

  addCategory(category: Category): Promise<Category | false>;
  getAllCategories(): Promise<Category[]>;
  getCategoriesByUserId(id: string): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  updateCategory(id: string, updatedCategory: Partial<Category>): Promise<boolean>;
  deleteCategory(id: string): Promise<boolean>;

  addPlacemark(categoryId: string, placemark: Placemark): Promise<Placemark | null>;
  getPlacemarksByCategoryId(categoryId: string): Promise<Placemark[]>;
  getPlacemarkById(id: string): Promise<Placemark | null>;
  updatePlacemark(id: string, updatedPlacemark: Partial<Placemark>): Promise<boolean>;
  deletePlacemark(id: string): Promise<boolean>;
}
