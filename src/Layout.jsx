import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800;900&display=swap');
        * {
          font-family: 'Rubik', sans-serif;
        }
        :root {
          --color-primary: #6366f1;
          --color-secondary: #a855f7;
        }
        body {
          overflow-x: hidden;
        }
        /* Hide scrollbar but allow scroll */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
      {children}
    </div>
  );
}