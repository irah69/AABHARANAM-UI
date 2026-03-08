// Product data - Empty array ready for backend API integration
// Once backend is ready, replace this with API calls
export const dressProducts = [
  {
    id: 1,
    name: 'Elegant Black Evening Dress',
    price: 2499,
    originalPrice: 4999,
    category: 'Evening Dresses',
    categorySlug: 'evening-dresses',
    slug: 'elegant-black-evening-dress-1',
    image: '/saree.png',
    description: 'A stunning black evening dress perfect for formal occasions',
    rating: 4.5,
    reviews: 120,
  },
  {
    id: 2,
    name: 'Casual Summer Floral Dress',
    price: 1299,
    originalPrice: 2499,
    category: 'Casual Dresses',
    categorySlug: 'casual-dresses',
    slug: 'casual-summer-floral-dress-2',
    image: '/saree.png',
    description: 'Lightweight and colorful casual dress for summer',
    rating: 4.2,
    reviews: 85,
  },
  {
    id: 3,
    name: 'Professional Office Dress',
    price: 1999,
    originalPrice: 3999,
    category: 'Office Dresses',
    categorySlug: 'office-dresses',
    slug: 'professional-office-dress-3',
    image: '/saree.png',
    description: 'Perfect for office wear - professional and elegant',
    rating: 4.8,
    reviews: 150,
  },
  {
    id: 4,
    name: 'Party Night Sequin Dress',
    price: 3499,
    originalPrice: 6999,
    category: 'Party Dresses',
    categorySlug: 'party-dresses',
    slug: 'party-night-sequin-dress-4',
    image: '/saree.png',
    description: 'Glamorous sequin dress for party nights',
    rating: 4.6,
    reviews: 95,
  },
];

// Categories
export const categories = [
  'All Products',
  'Casual Dresses',
  'Evening Dresses',
  'Office Dresses',
  'Party Dresses',
];

// Price ranges
export const priceRanges = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 - ₹3,000', min: 2000, max: 3000 },
  { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: 10000 },
];

// Ratings
export const ratingFilters = [
  { label: '★★★★★ 5 Star', value: 5 },
  { label: '★★★★☆ 4 Stars & up', value: 4 },
  { label: '★★★☆☆ 3 Stars & up', value: 3 },
  { label: '★★☆☆☆ 2 Stars & up', value: 2 },
];

// Sizes
export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Colors
export const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Green', hex: '#008000' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Purple', hex: '#800080' },
];

// Fabrics
export const fabrics = ['Cotton', 'Silk', 'Linen', 'Polyester', 'Wool', 'Denim', 'Chiffon'];

// Occasions
export const occasions = ['Casual', 'Party', 'Wedding', 'Office', 'Festive', 'Beach', 'Sports'];
