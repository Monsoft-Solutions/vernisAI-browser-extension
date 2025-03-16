# CLAUDE.md - VernisAI Chrome Extension

## Build & Development Commands
```
npm install           # Install dependencies
npm run dev           # Start development server with HMR
npm run build         # Production build
npm run test          # Run all tests
npm run test:unit     # Run unit tests only
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
```

## Code Style Guidelines
- **Framework**: React 18+ with TypeScript & functional components
- **State**: React Context API and hooks for state management
- **CSS**: Tailwind with CSS modules for component styling
- **Components**: Shadcn UI for accessible UI components
- **Naming**: PascalCase for components, camelCase for variables/functions
- **File Structure**: One component per file, grouped by feature
- **Imports**: Import order: React, external libs, internal modules, styles
- **Types**: Use explicit TypeScript interfaces, avoid `any`
- **Error Handling**: Try/catch with typed errors, fallback UI components

## Architecture
- Component-based React architecture with TypeScript
- Chrome Extension manifest v3 compliant
- OpenAI API integration for content generation
- Chrome Storage API for user preferences