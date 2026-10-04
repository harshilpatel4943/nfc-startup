export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'STARTER' | 'THANDA KA MOUJ' | 'SOUP' | 'MAIN COURSE' | 'RICE & BREADS' | 'DESSERTS';
  isMaharajaSpecial?: boolean;
  isVegetarian?: boolean;
  spicinessLevel?: 1 | 2 | 3;
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  titleHindi?: string;
  subtitle: string;
}

export const menuCategories: MenuCategory[] = [
  { id: 'STARTER', name: 'STARTER', titleHindi: 'शुरुआत', subtitle: 'Handcrafted appetizers & tandoori delights' },
  { id: 'THANDA KA MOUJ', name: 'THANDA KA MOUJ', titleHindi: 'ठंडा का मौज', subtitle: 'Traditional cold elixirs & refreshing sharbats' },
  { id: 'SOUP', name: 'SOUP', titleHindi: 'शूर्बा', subtitle: 'Aromatic broths & warm herbal extracts' },
  { id: 'MAIN COURSE', name: 'MAIN COURSE', titleHindi: 'मुख्य भोजन', subtitle: 'Rich regional curries & slow-cooked gravies' },
  { id: 'RICE & BREADS', name: 'RICE & BREADS', titleHindi: 'चावल एवं रोटी', subtitle: 'Dum biryanis & clay-oven baked artisanal breads' },
  { id: 'DESSERTS', name: 'DESSERTS', titleHindi: 'मीठा', subtitle: 'Traditional Indian sweets & royal desserts' },
];

export const menuItems: MenuItem[] = [
  // STARTERS
  {
    id: 'st-1',
    name: 'SCHEZWAN PANEER TIKKA',
    description: 'House-made Schezwan sauce • Hung curd • Indian spices • Cottage cheese cooked in clay tandoor',
    price: 399,
    category: 'STARTER',
    isVegetarian: true,
    spicinessLevel: 2,
    tags: ['Tandoor', 'Popular']
  },
  {
    id: 'st-2',
    name: 'LUCKNOWI SILKEN MALAI PANEER TIKKA',
    description: 'Hung curd • Cottage cheese • Awadhi aromatic spices • Country butter finish',
    price: 419,
    category: 'STARTER',
    isMaharajaSpecial: true,
    isVegetarian: true,
    spicinessLevel: 1,
    tags: ['Chef Special', 'Mild']
  },
  {
    id: 'st-3',
    name: 'ANDHRA STYLE CHILLI PANEER',
    description: 'Fiery Guntur chillies • Fresh curry leaves • Crushed garlic • Tossed cottage cheese',
    price: 389,
    category: 'STARTER',
    isVegetarian: true,
    spicinessLevel: 3,
    tags: ['Spicy', 'South Regional']
  },
  {
    id: 'st-4',
    name: 'SPICY HUMMUS WITH KHAKHRA',
    description: 'Roasted chickpea & Kashmiri red pepper dip • Served with crisp house artisanal thali khakhra',
    price: 349,
    category: 'STARTER',
    isVegetarian: true,
    spicinessLevel: 1,
    tags: ['Fusion', 'Crispy']
  },
  {
    id: 'st-5',
    name: 'PANEER TIKKA WRAPSTAR',
    description: 'Tandoori marinated paneer strips • Mint chutney • Pickled onions in paper-thin roomali bread',
    price: 379,
    category: 'STARTER',
    isVegetarian: true,
    spicinessLevel: 2
  },
  {
    id: 'st-6',
    name: 'SCHEZWAN MANCHURIAN',
    description: 'Crispy seasonal vegetable dumplings tossed in spicy Indo-Chinese Schezwan glaze & spring greens',
    price: 359,
    category: 'STARTER',
    isVegetarian: true,
    spicinessLevel: 2
  },
  {
    id: 'st-7',
    name: 'THEPLA NACHO',
    description: 'Crispy spiced Gujarati fenugreek wheat chips • Topped with melted cheese, tomato salsa & mint drizzle',
    price: 329,
    category: 'STARTER',
    isVegetarian: true,
    spicinessLevel: 1,
    tags: ['Gujarati Regional']
  },
  {
    id: 'st-8',
    name: 'AWADHI MALAI CHAAR',
    description: 'Tender soya chaap marinated in rich cashew malai cream, green cardamom & royal saffron',
    price: 399,
    category: 'STARTER',
    isMaharajaSpecial: true,
    isVegetarian: true,
    spicinessLevel: 1,
    tags: ['Royal Awadhi']
  },
  {
    id: 'st-9',
    name: 'KEBAB-E-HARA',
    description: 'Pan-seared spinach, green pea & roasted cumin patties infused with raw mango powder',
    price: 369,
    category: 'STARTER',
    isVegetarian: true,
    spicinessLevel: 1
  },
  {
    id: 'st-10',
    name: 'JODHPURI MIRCHI WADA',
    description: 'Traditional Marwari large fiery chillies stuffed with spiced potato mash & fried in gram flour',
    price: 319,
    category: 'STARTER',
    isVegetarian: true,
    spicinessLevel: 3,
    tags: ['Rajasthani Regional']
  },

  // THANDA KA MOUJ
  {
    id: 'th-1',
    name: 'THANDAI',
    description: 'Traditional chilled milk infused with ground almonds, melon seeds, royal saffron & dried rose petals',
    price: 229,
    category: 'THANDA KA MOUJ',
    isMaharajaSpecial: true,
    isVegetarian: true,
    tags: ['Royal Beverage']
  },
  {
    id: 'th-2',
    name: 'PUDINA NIMBOO KI SHIKANJI',
    description: 'Cooling fresh mint crushed with key lime, rock salt, roasted cumin & chilled soda',
    price: 189,
    category: 'THANDA KA MOUJ',
    isVegetarian: true,
    tags: ['Refreshing']
  },
  {
    id: 'th-3',
    name: 'KHAS KA SHARBAT',
    description: 'Cool vetiver grass extract elixir sweetened with organic sugar & soaked basil seeds',
    price: 199,
    category: 'THANDA KA MOUJ',
    isVegetarian: true
  },
  {
    id: 'th-4',
    name: 'KOKUM SHARBAT',
    description: 'Tangy wild mangosteen extract spiced with crushed pink salt & roasted cumin powder',
    price: 199,
    category: 'THANDA KA MOUJ',
    isVegetarian: true,
    tags: ['Konkan Regional']
  },

  // SOUPS
  {
    id: 'sp-1',
    name: 'TOMATO BASIL SOUP',
    description: 'Rich vine-ripened tomato extract finished with fresh basil leaves & garlic croutons',
    price: 249,
    category: 'SOUP',
    isVegetarian: true
  },
  {
    id: 'sp-2',
    name: 'MINESTRONE SOUP',
    description: 'Hearty Indian vegetable broth with diced roots, macaroni pasta & garden herbs',
    price: 269,
    category: 'SOUP',
    isVegetarian: true
  },
  {
    id: 'sp-3',
    name: 'HOT AND SOUR SOUP',
    description: 'Spicy & sour dark mushroom broth with shredded bamboo shoots, cabbage & green chillies',
    price: 259,
    category: 'SOUP',
    isVegetarian: true,
    spicinessLevel: 2
  },
  {
    id: 'sp-4',
    name: 'LEMON CORIANDER SOUP',
    description: 'Clear citrus broth simmered with fresh coriander stems, mushrooms & diced vegetables',
    price: 249,
    category: 'SOUP',
    isVegetarian: true,
    spicinessLevel: 1
  },

  // MAIN COURSE
  {
    id: 'mc-1',
    name: 'LEHSUNI PALAK PANEER',
    description: 'Fresh farm spinach purée tempered with burnt garlic, pure desi ghee & cottage cheese cubes',
    price: 449,
    category: 'MAIN COURSE',
    isVegetarian: true,
    spicinessLevel: 1,
    tags: ['Signature']
  },
  {
    id: 'mc-2',
    name: 'AWADHI SUBZ MILONI',
    description: 'Seasonal garden vegetables simmered in a velvet cashew & onion gravy infused with green cardamom',
    price: 429,
    category: 'MAIN COURSE',
    isMaharajaSpecial: true,
    isVegetarian: true,
    spicinessLevel: 1,
    tags: ['Royal Gravy']
  },
  {
    id: 'mc-3',
    name: 'CHEESE BALL CURRY',
    description: 'Golden cottage cheese dumplings cooked in a rich, buttery tomato makhani gravy',
    price: 469,
    category: 'MAIN COURSE',
    isVegetarian: true,
    tags: ['Rich & Creamy']
  },
  {
    id: 'mc-4',
    name: 'SOYA CHAAP CURRY',
    description: 'Tandoor-roasted soya chaap simmered in a robust North Indian onion-tomato gravy',
    price: 439,
    category: 'MAIN COURSE',
    isVegetarian: true,
    spicinessLevel: 2
  },
  {
    id: 'mc-5',
    name: 'CHETTINAD PANEER',
    description: 'Fiery South Indian coconut, star anise & freshly ground black pepper curry with paneer',
    price: 459,
    category: 'MAIN COURSE',
    isVegetarian: true,
    spicinessLevel: 3,
    tags: ['Tamil Regional']
  },
  {
    id: 'mc-6',
    name: 'BAINGAN KA BHARTA',
    description: 'Smoky clay-oven roasted eggplant mash tempered with raw onions, garlic, green chillies & mustard oil',
    price: 389,
    category: 'MAIN COURSE',
    isVegetarian: true,
    spicinessLevel: 2,
    tags: ['Rustic Classic']
  },
  {
    id: 'mc-7',
    name: 'CHEESE KAJU MUSSALLAM',
    description: 'Royal Mughlai roasted cashews and paneer cooked in a saffron-infused nut gravy',
    price: 499,
    category: 'MAIN COURSE',
    isMaharajaSpecial: true,
    isVegetarian: true,
    tags: ['Maharaja Special', 'Chef Choice']
  },
  {
    id: 'mc-8',
    name: 'MALAI PYAZ KI SUBZI',
    description: 'Sweet baby spring onions stewed in a rich cream gravy scented with nutmeg & mace',
    price: 419,
    category: 'MAIN COURSE',
    isVegetarian: true
  },
  {
    id: 'mc-9',
    name: 'DUNGRI BATAKA NU SHAK',
    description: 'Traditional Kathiyawadi baby potato & red onion curry prepared with roasted sesame & red chilli oil',
    price: 379,
    category: 'MAIN COURSE',
    isVegetarian: true,
    spicinessLevel: 2,
    tags: ['Kathiyawadi Regional']
  },

  // RICE & BREADS
  {
    id: 'rb-1',
    name: 'DUM PUKHT SUBZ BIRYANI',
    description: 'Long-grain basmati rice layered with spiced vegetables, mint, saffron & steam-cooked under clay dough seal',
    price: 449,
    category: 'RICE & BREADS',
    isMaharajaSpecial: true,
    isVegetarian: true,
    tags: ['Biryani', 'Maharaja Special']
  },
  {
    id: 'rb-2',
    name: 'JEERA RICE',
    description: 'Aromatic basmati rice tempered with roasted cumin seeds and fresh desi ghee',
    price: 269,
    category: 'RICE & BREADS',
    isVegetarian: true
  },
  {
    id: 'rb-3',
    name: 'BUTTER NAAN',
    description: 'Clay tandoor baked leavened flatbread brushed with country butter',
    price: 99,
    category: 'RICE & BREADS',
    isVegetarian: true
  },
  {
    id: 'rb-4',
    name: 'GARLIC NAAN',
    description: 'Tandoori naan stuffed and topped with finely crushed roasted garlic & cilantro',
    price: 119,
    category: 'RICE & BREADS',
    isVegetarian: true
  },
  {
    id: 'rb-5',
    name: 'MISSI ROTI',
    description: 'Rustic gram flour & wheat flatbread seasoned with carom seeds & chopped onion baked in tandoor',
    price: 89,
    category: 'RICE & BREADS',
    isVegetarian: true
  },
  {
    id: 'rb-6',
    name: 'ROOMALI ROTI',
    description: 'Ultra-thin hand-spun soft flatbread folded like a handkerchief',
    price: 79,
    category: 'RICE & BREADS',
    isVegetarian: true
  },

  // DESSERTS
  {
    id: 'ds-1',
    name: 'ROYAL SHAHI TUKDA',
    description: 'Ghee-fried brioche soaked in saffron cardamom rabri, garnished with pistachios & edible silver leaf',
    price: 289,
    category: 'DESSERTS',
    isMaharajaSpecial: true,
    isVegetarian: true,
    tags: ['Royal Dessert']
  },
  {
    id: 'ds-2',
    name: 'GULAB JAMUN WITH ICE CREAM',
    description: 'Warm khoya dumplings soaked in rose syrup served alongside artisanal vanilla bean ice cream',
    price: 249,
    category: 'DESSERTS',
    isVegetarian: true
  },
  {
    id: 'ds-3',
    name: 'KESARI PHIRNI',
    description: 'Chilled ground basmati rice pudding slow-cooked with milk, saffron & almonds served in earthenware matka',
    price: 229,
    category: 'DESSERTS',
    isVegetarian: true
  }
];
