# RRSS AUTO | Enterprise Control Center

This is the admin-web frontend application serving as the Enterprise Control Center for RRSS AUTO. It is a React 19 + TypeScript + Vite project designed using a premium, glassmorphic dark/light visual theme.

## Architecture

ECC follows a Microkernel host model where views, tables, and settings are rendered dynamically.
- **State Store**: Managed via Zustand slices.
- **Routing**: Client-side dynamic loading.
- **Component Virtualization**: Standardized virtualized tables.
- **AI Operations**: Direct confirmation flow and CLI palette.

## Scripts

Run development server:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```
