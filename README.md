# Hierarchical Table Management

A modern React + TypeScript application for managing hierarchical tables with direct and percentage-based value allocation. Built with Vite and styled using Tailwind CSS.

## Screenshots
<img width="948" height="617" alt="image" src="https://github.com/user-attachments/assets/4519f203-0b99-4225-b71b-50bc737ed204" />

## Features

- Hierarchical data structure with parent and child rows
- Direct value allocation and percentage-based allocation for each row
- Automatic proportional distribution to children when parent is updated
- Real-time variance calculation compared to original values
- Grand total and variance display
- Fully typed with TypeScript for reliability
- Clean, modular codebase with reusable components
- Responsive and beautiful UI using Tailwind CSS

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── HierarchicalTable.tsx
│   │   └── TableRow.tsx
│   ├── types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── vite.config.ts
└── ...
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) to view the app.

## Usage

- Enter a percentage or value in the input field for any row.
- Use "Allocation %" to increase/decrease the value by the entered percentage.
- Use "Allocation Val" to set the value directly.
- Parent updates distribute values proportionally to children.
- Child updates automatically recalculate parent subtotals.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS

## Customization

- Edit `src/types.ts` to update or extend data types.
- Add new features or modify logic in `src/components/HierarchicalTable.tsx` and `src/components/TableRow.tsx`.
