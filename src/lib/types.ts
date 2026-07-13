export type CarBodyType = "Hatchback" | "Sedan" | "SUV" | "Coupe" | "Estate" | "EV";

export type Car = {
  id: string;
  slug: string;
  name: string;
  model: string;
  bodyType: CarBodyType;
  year: number;
  price: number;
  color: string;
  colorHex: string;
  horsepower: number;
  topSpeed: number;
  zeroToHundred: number;
  range: number; // km (for EV) or tank range
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  transmission: "Manual" | "Automatic" | "DSG";
  seats: number;
  description: string;
  features: string[];
  badge?: string;
  rating: number;
  inStock: boolean;
  image: string;
};

export type CartItem = {
  car: Car;
  quantity: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  status: "pending" | "confirmed" | "delivered";
};
