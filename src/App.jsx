import AppRouter from "./routes/router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 3000,
          },
        }}
      />
    </>
  );
}

export default App;
