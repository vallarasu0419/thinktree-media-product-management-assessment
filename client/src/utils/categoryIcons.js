const ICONS_BY_SLUG = {
  electronics: 'fa-solid fa-mobile-screen-button',
  clothing: 'fa-solid fa-shirt',
  books: 'fa-solid fa-book',
  'home-kitchen': 'fa-solid fa-kitchen-set',
  'sports-fitness': 'fa-solid fa-dumbbell',
  'toys-games': 'fa-solid fa-gamepad',
  'beauty-personal-care': 'fa-solid fa-spa',
  furniture: 'fa-solid fa-couch',
  groceries: 'fa-solid fa-cart-shopping',
  automotive: 'fa-solid fa-car',
  'health-wellness': 'fa-solid fa-heart-pulse',
  'music-instruments': 'fa-solid fa-music',
};

const FALLBACK_ICON = 'fa-solid fa-shapes';

export function getCategoryIcon(slug) {
  return ICONS_BY_SLUG[slug] || FALLBACK_ICON;
}
