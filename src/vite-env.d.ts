/// <reference types="vite/client" />

// Add this code here 👇
declare module '*.jpg' {
  const value: string;
  export default value;
}