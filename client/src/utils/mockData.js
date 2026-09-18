export const mockCategories = [
  { _id: '1', name: 'Bedroom', slug: 'bedroom', icon: '🛏️', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80', count: 48 },
  { _id: '2', name: 'Living Room', slug: 'living-room', icon: '🛋️', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', count: 62 },
  { _id: '3', name: 'Dining', slug: 'dining', icon: '🪑', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80', count: 35 },
  { _id: '4', name: 'Office', slug: 'office', icon: '💼', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', count: 29 },
]

export const mockProducts = [
  {
    _id: '1', title: 'Zen King Bed Frame', slug: 'zen-king-bed-frame',
    category: 'Bedroom', price: 34999, originalPrice: 45999,
    images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'],
    ratings: { average: 4.8, count: 124 }, stock: 10, featured: true, bestseller: true,
    description: 'Crafted from solid sheesham wood with a natural finish. The Zen bed frame brings timeless elegance to your bedroom.',
    discount: 24,
  },
  {
    _id: '2', title: 'Oslo 3-Seater Sofa', slug: 'oslo-3-seater-sofa',
    category: 'Living Room', price: 52999, originalPrice: 69999,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    ratings: { average: 4.7, count: 89 }, stock: 5, featured: true, bestseller: true,
    description: 'Scandinavian-inspired sofa with premium fabric upholstery and solid beech wood legs.',
    discount: 24,
  },
  {
    _id: '3', title: 'Maple Dining Table Set', slug: 'maple-dining-table-set',
    category: 'Dining', price: 28999, originalPrice: 38000,
    images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80'],
    ratings: { average: 4.6, count: 67 }, stock: 8, featured: true, bestseller: false,
    description: 'A stunning 6-seater dining table set in solid mango wood with a warm honey finish.',
    discount: 24,
  },
  {
    _id: '4', title: 'Executive Work Desk', slug: 'executive-work-desk',
    category: 'Office', price: 18999, originalPrice: 24999,
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
    ratings: { average: 4.5, count: 43 }, stock: 15, featured: true, bestseller: false,
    description: 'Sleek and spacious executive desk with cable management and premium wood veneer.',
    discount: 24,
  },
  {
    _id: '5', title: 'Velvet Accent Chair', slug: 'velvet-accent-chair',
    category: 'Living Room', price: 12999, originalPrice: 18000,
    images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80'],
    ratings: { average: 4.9, count: 201 }, stock: 20, featured: true, bestseller: true,
    description: 'Luxuriously upholstered in premium velvet with solid walnut legs. A statement piece.',
    discount: 28,
  },
  {
    _id: '6', title: 'Sheesham Wood Wardrobe', slug: 'sheesham-wood-wardrobe',
    category: 'Bedroom', price: 42999, originalPrice: 55000,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    ratings: { average: 4.7, count: 95 }, stock: 6, featured: false, bestseller: true,
    description: '4-door solid sheesham wardrobe with hanging space, shelves and drawers.',
    discount: 22,
  },
  {
    _id: '7', title: 'Ceramic Coffee Table', slug: 'ceramic-coffee-table',
    category: 'Living Room', price: 8999, originalPrice: 12000,
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'],
    ratings: { average: 4.4, count: 52 }, stock: 12, featured: false, bestseller: false,
    description: 'Modern coffee table with a handcrafted ceramic top and brass-finish metal base.',
    discount: 25,
  },
  {
    _id: '8', title: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair',
    category: 'Office', price: 15999, originalPrice: 22000,
    images: ['https://images.unsplash.com/photo-1589384267710-7a25bc5b4862?w=800&q=80'],
    ratings: { average: 4.8, count: 178 }, stock: 25, featured: true, bestseller: true,
    description: 'Full lumbar support, adjustable armrests, breathable mesh back. Work in luxury.',
    discount: 27,
  },
]

export const mockTestimonials = [
  {
    _id: '1', name: 'Priya Sharma', location: 'Mumbai',
    rating: 5, text: 'Absolutely love my new Oslo sofa! The quality is exceptional and delivery was prompt. maaVaishno has redefined luxury furniture for me.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    product: 'Oslo 3-Seater Sofa',
  },
  {
    _id: '2', name: 'Arjun Mehta', location: 'Bangalore',
    rating: 5, text: 'The Zen King Bed Frame is a masterpiece. Solid wood, beautiful finish, and it transformed our bedroom completely.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    product: 'Zen King Bed Frame',
  },
  {
    _id: '3', name: 'Sneha Reddy', location: 'Hyderabad',
    rating: 5, text: 'Customer service is phenomenal. They helped me choose the right dining set and the installation team was professional.',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    product: 'Maple Dining Table Set',
  },
]
