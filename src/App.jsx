import AppRouter from "./routes/router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
       
        reverseOrder={false}
        toastOptions={{
          success: {
            duration: 200,
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
