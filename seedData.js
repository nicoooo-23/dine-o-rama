// Initial restaurants, inserted automatically the first time the app runs on an empty collection.
// Each row: [name, cuisine, address, rating]. restaurant_id and contact are generated below.
const rows = [
  ['Kapampangan Grill', 'Filipino', 'Angeles City', 4.5], ['Spice Route', 'Indian', 'Clark', 4.3],
  ['Pasta House', 'Italian', 'San Fernando', 4.1],        ['Tokyo Bites', 'Japanese', 'Angeles City', 4.7],
  ['Dragon Wok', 'Chinese', 'Mabalacat', 4.2],            ['Burger Republic', 'American', 'Clark', 4.0],
  ['Seoul Kitchen', 'Korean', 'Angeles City', 4.6],       ['Taco Fiesta', 'Mexican', 'San Fernando', 4.1],
  ['Ocean Catch', 'Seafood', 'Mabalacat', 4.4],           ['Green Garden', 'Vegetarian', 'Angeles City', 4.3],
  ['Coffee Corner', 'Cafe', 'Clark', 4.2],                ['Pizza Haven', 'Italian', 'San Fernando', 4.5],
  ['Sushi Wave', 'Japanese', 'Angeles City', 4.8],        ['BBQ Nation', 'Filipino', 'Mabalacat', 4.4],
  ['Wok Express', 'Chinese', 'Clark', 4.1],               ['Burger Shack', 'American', 'Angeles City', 4.0],
  ['Kimchi Palace', 'Korean', 'San Fernando', 4.7],       ['Fiesta Mexicana', 'Mexican', 'Clark', 4.2],
  ['Harbor Seafood', 'Seafood', 'Angeles City', 4.6],     ['Fresh Bowl', 'Vegetarian', 'Mabalacat', 4.1],
  ['Morning Brew', 'Cafe', 'San Fernando', 4.3],          ['Little Italy', 'Italian', 'Clark', 4.4],
  ['Ramen House', 'Japanese', 'Angeles City', 4.5],       ['Lutong Bahay', 'Filipino', 'San Fernando', 4.2],
  ['Golden Dragon', 'Chinese', 'Clark', 4.4],             ['Smokehouse Grill', 'American', 'Mabalacat', 4.1],
  ['Korean Table', 'Korean', 'Angeles City', 4.5],        ['Casa Burrito', 'Mexican', 'San Fernando', 4.2],
  ['Blue Ocean Bistro', 'Seafood', 'Clark', 4.7],         ['Healthy Harvest', 'Vegetarian', 'Angeles City', 4.3],
];

module.exports = rows.map(([name, cuisine, address, rating], i) => ({
  restaurant_id: i + 1, name, cuisine, address, rating,
  contact: String(9171234567 + i).padStart(11, '0')   // 09171234567, 09171234568, ...
}));
