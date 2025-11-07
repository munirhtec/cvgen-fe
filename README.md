# CV HTEC AI Assistant

## Overview
The **CV HTEC AI Assistant** provides an intuitive interface for generating, analyzing, and reviewing employee CVs with AI assistance. It allows users to input job descriptions either by pasting text or providing a URL, then generates suggestions and matches with potential candidates.

## Features

### 1. **Job Description Analyzer**
   - **Tabs for Input Type**: Users can either paste a job description or provide a job URL.
   - **Job Description Analysis**: Analyzes the input to suggest the best candidate matches based on the job description.
   - **Dynamic Button Text**: Button text changes based on input type and loading state (e.g., "Analyze Job Description" or "Analyze from URL").
   
### 2. **Candidate Matching**
   - **Results Display**: Shows a list of candidates with their full name, email, current role, business context, and similarity percentage.
   - **Similarity Rating**: Candidates are rated with labels like "Elite", "Excellent", etc., based on their match percentage to the job description.
   - **Detailed View**: Clicking a candidate reveals more details like personal information and skills.

### 3. **CV Generation and Feedback**
   - **Draft CV Creation**: Generate a CV draft based on a user query or feedback.
   - **Feedback Mechanism**: Allows users to add feedback for improving the generated CV.
   - **Reset Option**: Reset the draft from a previous session or re-fetch data from a backend system.
   - **Export CV**: Users can export the generated CV to different formats.

### 4. **Interactive Elements**
   - **Popover for Feedback**: Displays a list of feedback on the side for quick reference.
   - **Modals for Confirmation**: Includes modals for resetting or discarding drafts.

## Components
- **JobDescriptionForm**: A form to submit and switch between the description and URL inputs for job analysis.
- **JobResults**: Displays the matching candidates and their details based on job description analysis.
- **CVChat**: Manages CV creation, feedback, and resetting functionality.

## Technologies Used
- React, TypeScript, Tailwind CSS
- UI components from `@/components/ui`
- Fetching API data with `fetch` and React Query
- Toast notifications using `sonner`
- State management with React's `useState` and `useEffect`

## Setup
1. Clone the repository.
2. Install dependencies:  
   `npm install`
3. Set up environment variables, including `VITE_API_URL` for the backend API.
4. Run the app:  
   `npm run dev`

## License
MIT License
