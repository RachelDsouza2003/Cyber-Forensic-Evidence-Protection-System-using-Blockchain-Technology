// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global CSS for styling
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals'; // For measuring performance

// Create the root element where the React app will be rendered
const root = ReactDOM.createRoot(document.getElementById('root'));

// Error boundaries can catch runtime errors during rendering
function ErrorBoundary({ children }) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {children}
    </React.Suspense>
  );
}

// Render the root component <App /> inside React.StrictMode
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Optional: Measure performance of the app
// To start measuring performance, pass a function to reportWebVitals
// This will log the performance metrics (or send them to an endpoint)
reportWebVitals((metric) => {
  console.log(metric);
  // Optionally send this data to an analytics endpoint
  // fetch('https://analytics.example.com', {
  //   method: 'POST',
  //   body: JSON.stringify(metric),
  // });
});
