// src/data/team.js

// This resolver automatically finds images in src/assets/team/
// It matches the 'name' below to the filename (case-insensitive).
const fallback = 'https://via.placeholder.com/150';

let resolver = null;
try {
    // Look for .png, .jpg, .jpeg, .svg files
    const ctx = require.context('../assets/team', false, /\.(png|jpe?g|svg)$/);
    
    const map = ctx.keys().reduce((acc, key) => {
        // clean up filename: ./Sophear.jpg -> sophear
        const filename = key.replace('./', '');
        const nameNoExt = filename.replace(/\.[^/.]+$/, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ''); // remove spaces/symbols for easier matching
        
        acc[nameNoExt] = ctx(key);
        return acc;
    }, {});

    resolver = (personName) => {
        if (!personName) return null;
        // Normalize the person's name to match the filename
        const normalized = personName.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Return the image if found
        if (map[normalized]) return map[normalized];
        return null;
    };
} catch (err) {
    console.error("Team image resolver failed:", err);
    resolver = () => null;
}

// 👇 UPDATED LIST TO MATCH YOUR FILES IN src/assets/team/
const raw = [
    { id: 1, name: 'Sophear', role: 'Frontend Developer' },     // Matches Sophear.jpg
    { id: 2, name: 'Vathana', role: 'Backend Developer' },      // Matches Vathana.jpg
    { id: 3, name: 'Khim',    role: 'UI/UX Designer' },         // Matches Khim.jpg
    { id: 4, name: 'Doek',    role: 'Project Manager' },        // Matches Doek.jpg
    { id: 5, name: 'Admin',   role: 'Administrator' },          // Matches Admin.jpg
    { id: 6, name: 'Eang Phanha', role: 'Developer' },          // Matches Eang Phanha.jpg
    { id: 7, name: 'Loa Phanha',  role: 'Developer' },          // Matches Loa Phanha.jpg
];

const team = raw.map(m => {
    const avatar = resolver ? resolver(m.name) : null;
    // Use the found avatar, or fallback if not found
    return { ...m, avatar: avatar || fallback };
}); 

export default team;