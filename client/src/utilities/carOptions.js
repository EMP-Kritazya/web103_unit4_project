// Fixed customization data for the builder UI. These mirror the backend
// (server/config/carOptions.js), which stays the source of truth for the
// price that actually gets saved. Keep the two in sync when adding options.

export const BASE_PRICE = 30000

export const OPTIONS = {
    exterior: [
        { name: 'Silver', price: 0 },
        { name: 'Black', price: 500 },
        { name: 'Blue', price: 750 },
        { name: 'Red', price: 1000 },
        { name: 'Matte Green', price: 1500 },
    ],
    roof: [
        { name: 'Body Color', price: 0 },
        { name: 'Black Roof', price: 800 },
        { name: 'Moonroof', price: 2000 },
        { name: 'Convertible', price: 5000 },
    ],
    wheels: [
        { name: '18" Silver Alloy', price: 0 },
        { name: '19" Black Alloy', price: 1200 },
        { name: '20" Chrome', price: 2500 },
    ],
    interior: [
        { name: 'Charcoal Cloth', price: 0 },
        { name: 'Black Leather', price: 1800 },
        { name: 'White Leather', price: 2500 },
    ],
}

// The four fields that make up a car configuration.
export const FEATURES = ['exterior', 'roof', 'wheels', 'interior']

// Friendly labels for each feature (used as selector headings).
export const FEATURE_LABELS = {
    exterior: 'Exterior Color',
    roof: 'Roof',
    wheels: 'Wheels',
    interior: 'Interior',
}

// Maps an exterior color name to a CSS color so the preview updates visually.
export const EXTERIOR_COLOR_HEX = {
    Silver: '#c0c4c8',
    Black: '#1c1c1c',
    Blue: '#1e5fb4',
    Red: '#c62828',
    'Matte Green': '#4b5d43',
}

// A sensible default configuration for a brand-new build.
export const defaultCar = () => ({
    name: '',
    exterior: OPTIONS.exterior[0].name,
    roof: OPTIONS.roof[0].name,
    wheels: OPTIONS.wheels[0].name,
    interior: OPTIONS.interior[0].name,
})
