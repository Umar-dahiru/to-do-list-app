# Daylist — To-Do List App

A clean, responsive task manager built with HTML, CSS and vanilla JavaScript. Tasks are stored in your browser using `localStorage`, so they remain available after refreshing the page on the same browser and device.

## Features
- Add tasks quickly
- Mark tasks as completed or active
- Edit and delete tasks
- Filter all, active and completed tasks
- Clear all completed tasks
- Live task counts
- Persistent browser storage
- Responsive layout for mobile and desktop
- Keyboard-accessible controls

## Run locally
Open `index.html` in a modern browser, or run a local server:

```bash
python3 -m http.server 8080
```

Visit http://localhost:8080.

## Project structure
```
to-do-list-app/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── .gitignore
└── README.md
```

## Data and privacy
Tasks are saved locally in the browser. There is no account, server, or cloud sync. Clearing browser site data may remove saved tasks.

## License
MIT