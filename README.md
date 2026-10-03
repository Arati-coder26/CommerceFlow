# CommerceFlow

CommerceFlow is a product and inventory management dashboard built with React and TypeScript.

## Features

- **Inventory overview:** See the number of products, total units in stock, average listed price, low-stock count, and most common category.
- **Product catalog:** Search by product name or category, filter by category, and sort by price or rating. The catalog displays 12 products at a time with a Load more option.
- **Product details:** Open a listing to view its image, description, category, price, rating, stock quantity, and availability.
- **Catalog management:** Add new listings and edit or delete existing ones. Product changes are saved in this browser's local storage; they are not sent to a backend.
- **Sample data:** Load products from the Fake Store API, with a local fallback catalog when the API is unavailable.

The Classic Cotton T-Shirt listing is demo data. Its price and inventory are samples, not current retail information.

## Getting Started

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Build

```bash
npm run build
```

To serve a production build locally, run `npm run preview` after building.

## Technology

- React 18 and TypeScript
- Vite
- React Router
- TanStack Query
- Axios
