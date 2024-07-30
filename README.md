![image](https://github.com/user-attachments/assets/29748268-0681-4cab-9d82-a0d24414efc4)


## Trello-Style Task Management Application

This project is a web-based task management application similar to Trello. It allows users to manage tasks across different columns, representing the different stages of task completion. The application includes user authentication and authorization, task creation and management, drag-and-drop functionality for task movement, and data persistence using MongoDB.

### Features
#### 1. User Authentication:
- Signup and login functionality using email and password
- Secure password storage and user session management
- Google Authentication: Users can also sign in using their Google accounts

#### 2. Task Board:
- Personal task board displayed upon logging in
- Four columns: "To-Do", "In Progress", “Under Review”, and "Completed"

#### 3. Task Management:
- Create new tasks in any column
- Each task includes:
- Title (mandatory)
- Description (optional)
- Status (mandatory; auto-filled if created from a specific section)
- Priority (optional; values: Low, Medium, Urgent)
- Deadline (optional)
- Edit and delete tasks after creation

#### 4. Drag and Drop Functionality:
- Move tasks between columns with drag-and-drop
- Task status updates automatically when moved to a different column
  
#### Data Persistence:
- All user data (account information and tasks) stored in MongoDB
- Each user can only see and manage their own tasks

### Technologies
- Frontend: Next.js with TypeScript
- Backend: Node.js, Express and TypeScript
- Database: MongoDB
- State Management: Redux Toolkit
- Styling: Tailwind CSS with Shadcn-UI
