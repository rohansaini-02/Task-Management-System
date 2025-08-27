<<<<<<< HEAD
# Task-Management-System
=======
# 📋 Tamasha Boards - Trello-like Task Management App

A modern, responsive Trello-like task management application built with React. Features multiple boards, lists, cards with drag-and-drop functionality, and persistent data storage using localStorage.

## Project Overview

This is a **frontend-only** task management application that mimics Trello's core functionality:
- **Multiple boards** for organizing different projects
- **Lists within boards** (To Do, In Progress, Done)
- **Cards with titles and descriptions**
- **Drag-and-drop** for reordering and moving items
- **Data persistence** using browser localStorage
- **No backend required** - everything runs in the browser

##  Tech Stack

- **Framework**: React 19.1.1 with Vite 7.1.2
- **Styling**: SCSS with CSS Variables for theming
- **Drag & Drop**: @dnd-kit/core & @dnd-kit/sortable
- **Routing**: React Router DOM 7.8.2
- **State Management**: React Context + useReducer
- **Build Tool**: Vite
- **Package Manager**: npm

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation & Setup

1. **Clone or download** the project files
2. **Navigate** to the project directory:
   ```bash
   cd tamasha_project
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to `http://localhost:5173`

**That's it!** The app should be running in under 2 minutes. 




## Feature Checklist

###  Core Requirements (Assignment Criteria)

#### **1. Dashboard Page**
- [x] Display all created boards
- [x] Create new board (with name validation)
- [x] Delete board (with confirmation)
- [x] Rename board (inline editing)
- [x] Navigate to board on click
- [x] **Bonus**: Drag-and-drop board reordering

#### **2. Board Management**
- [x] Default lists: "To Do", "In Progress", "Done"
- [x] Add new list functionality
- [x] Rename list (inline editing)
- [x] Delete list (with confirmation)
- [x] **Bonus**: Horizontal list reordering via drag-and-drop

#### **3. Task (Card) Management**
- [x] Add new card (title required)
- [x] Edit card via modal (title + optional description)
- [x] Delete card functionality
- [x] **Bonus**: Drag-and-drop cards between lists

#### **4. Data Persistence**
- [x] localStorage integration
- [x] State persistence across page reloads
- [x] Automatic saving on state changes

#### **5. Component Architecture**
- [x] React functional components
- [x] useState, useEffect, useReducer hooks
- [x] Logical component organization
- [x] Custom hooks (useBoards, useLocalStorage)

###  Bonus Features Implemented

#### **Advanced Functionality**
- [x] **Dark/Light Theme Toggle** - Persistent theme preference
- [x] **Search Functionality** - Search boards and cards
- [x] **Export/Import State** - Backup and restore data as JSON
- [x] **Responsive Design** - Works on desktop and mobile
- [x] **Accessibility Features** - ARIA labels, keyboard navigation

#### **UI/UX Enhancements**
- [x] **Professional Styling** - Modern, clean interface
- [x] **Hover Effects** - Smooth transitions and feedback
- [x] **Empty States** - Helpful messages when no data
- [x] **Truncated Titles** - Long titles with tooltips
- [x] **Confirmation Dialogs** - Safe deletion workflows
- [x] **Focus Management** - Proper keyboard navigation

## User Interface

### **Dashboard Features**
- Clean grid layout for boards
- Search bar for filtering boards
- Theme toggle in navigation
- Export/Import functionality
- Responsive design

### **Board Features**
- Horizontal scrolling lists
- Sticky "Add new list" composer
- Drag-and-drop for cards and lists
- Modal for card editing
- Search functionality for cards

### **Accessibility**
- Keyboard navigation support
- ARIA labels and roles
- Focus management in modals
- Screen reader friendly

## Project Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── BoardCard.jsx   # Individual board display
│   ├── DraggableCard.jsx # Draggable card wrapper
│   ├── Modal.jsx       # Reusable modal component
│   ├── Navbar.jsx      # Top navigation
│   ├── SearchBar.jsx   # Search functionality
│   ├── ThemeToggle.jsx # Dark/light theme toggle
│   └── ExportImport.jsx # Data backup/restore
├── pages/              # Main page components
│   ├── Dashboard.jsx   # Board overview page
│   └── Board.jsx       # Individual board page
├── hooks/              # Custom React hooks
│   ├── useBoards.js    # Boards context hook
│   └── useLocalStorage.jsx # localStorage hook
├── state/              # State management
│   └── boardsReducer.js # Main state reducer
├── utils/              # Utility functions
│   └── id.js           # ID generation
└── styles/             # Global styles
    └── index.scss      # Main stylesheet
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code (if configured)

# Testing (if added later)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## Configuration

### **Environment Variables**
No environment variables required - this is a frontend-only application.

### **Browser Compatibility**
- Chrome/Edge (latest)

## Known Limitations

### **Current Limitations**
- **Data Storage**: Limited to browser localStorage (~5-10MB)
- **Collaboration**: No real-time collaboration features
- **File Attachments**: No file upload functionality
- **Offline**: Requires internet for initial load
- **Data Recovery**: No automatic backup to cloud

### **Browser Storage Limits**
- localStorage has size limits (~5-10MB depending on browser)
- Data is browser-specific (not synced across devices)
- Clearing browser data will remove all boards

## Future Improvements

### **Potential Enhancements**
- **Cloud Storage**: Integration with Firebase/Backend
- **Real-time Collaboration**: WebSocket support
- **File Attachments**: Image/document uploads
- **Advanced Search**: Filters, tags, date ranges
- **Templates**: Pre-built board templates
- **Analytics**: Usage statistics and insights
- **Mobile App**: React Native version
- **Offline Support**: Service Worker implementation

### **Technical Improvements**
- **Testing**: Unit and integration tests
- **Performance**: Virtual scrolling for large lists
- **PWA**: Progressive Web App features
- **TypeScript**: Type safety implementation
- **State Management**: Redux Toolkit migration

## Contributing

This is an assignment project, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Developer Notes

### **Key Implementation Decisions**
- **useReducer over useState**: For complex state management
- **@dnd-kit over react-beautiful-dnd**: Better performance and accessibility
- **SCSS over Tailwind**: More control over theming and animations
- **localStorage over IndexedDB**: Simpler for assignment scope

### **Performance Considerations**
- Debounced localStorage saves
- Memoized components with React.memo
- Efficient drag-and-drop algorithms
- Optimized re-renders

### **Accessibility Features**
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader compatibility

