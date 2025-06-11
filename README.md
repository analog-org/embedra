# Embedra

A modern web application for creating and previewing Discord embeds with a rich UI and real-time preview.

## Features

- 🎨 Real-time Discord embed preview
- 📝 Rich markdown editor with syntax highlighting
- 🎯 Intuitive UI components based on Radix UI
- 🌈 Advanced color picker for customization
- 😄 Emoji picker integration
- 📅 Date and time selection tools
- 🔒 Authentication system
- ⚡ Built with performance in mind using Astro

## Tech Stack

- **Framework:** [Astro](https://astro.build/) with React integration
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Discord Components:** [@skyra/discord-components-react](https://github.com/skyra-project/discord-components)
- **Authentication:** Built-in auth system with SQLite storage
- **Form Handling:** React Hook Form with Zod validation
- **State Management:** Nanostores
- **Database:** SQLite with Drizzle ORM

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/embedra.git
cd embedra
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file and configure your environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:4321`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

## Development

The project structure follows Astro's conventions:

```
src/
├── assets/         # Static assets
├── components/     # React components
│   └── ui/         # Reusable UI components
├── layouts/        # Astro layouts
├── lib/           # Utility functions and helpers
├── pages/         # Astro pages
│   └── api/       # API routes
├── store/         # Nanostores state management
└── styles/        # Global styles
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
