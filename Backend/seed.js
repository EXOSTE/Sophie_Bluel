const db = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
    await db.sequelize.sync({ force: true });
    console.log('Database reset.');

    // Seed user
    const hash = await bcrypt.hash('S0phie', 10);
    await db.users.create({ email: 'sophie.bluel@test.tld', password: hash });
    console.log('User created.');

    // Seed categories
    await db.categories.bulkCreate([
        { id: 1, name: 'Objets' },
        { id: 2, name: 'Appartements' },
        { id: 3, name: 'Hotels & restaurants' }
    ]);
    console.log('Categories created.');

    // Seed works
    const baseUrl = 'http://localhost:5678/images/';
    await db.works.bulkCreate([
        { id: 1, title: 'Abajour Tahina', imageUrl: baseUrl + 'abajour-tahina1651286843956.png', categoryId: 1, userId: 1 },
        { id: 2, title: 'Appartement Paris V', imageUrl: baseUrl + 'appartement-paris-v1651287270508.png', categoryId: 2, userId: 1 },
        { id: 3, title: 'Restaurant Sushisen - Londres', imageUrl: baseUrl + 'restaurant-sushisen-londres1651287319271.png', categoryId: 3, userId: 1 },
        { id: 4, title: 'Villa "La Balisiere" - Port Louis', imageUrl: baseUrl + 'la-balisiere1651287350102.png', categoryId: 3, userId: 1 },
        { id: 5, title: 'Structures Thermopolis', imageUrl: baseUrl + 'structures-thermopolis1651287380258.png', categoryId: 1, userId: 1 },
        { id: 6, title: 'Appartement Paris X', imageUrl: baseUrl + 'appartement-paris-x1651287435459.png', categoryId: 2, userId: 1 },
        { id: 7, title: 'Pavillon "Le coteau" - Cassis', imageUrl: baseUrl + 'le-coteau-cassis1651287469876.png', categoryId: 3, userId: 1 },
        { id: 8, title: 'Villa Ferneze - Isola d\'Elba', imageUrl: baseUrl + 'villa-ferneze1651287511604.png', categoryId: 3, userId: 1 },
        { id: 9, title: 'Appartement Paris XVIII', imageUrl: baseUrl + 'appartement-paris-xviii1651287541053.png', categoryId: 2, userId: 1 },
        { id: 10, title: 'Bar "Lullaby" - Paris', imageUrl: baseUrl + 'bar-lullaby-paris1651287567130.png', categoryId: 3, userId: 1 },
        { id: 11, title: 'Hotel First Arte - New Delhi', imageUrl: baseUrl + 'hotel-first-arte-new-delhi1651287605585.png', categoryId: 3, userId: 1 }
    ]);
    console.log('Works created.');

    console.log('Seed complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
