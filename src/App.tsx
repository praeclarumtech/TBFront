import RenderRouter from "routes/index";
import UserProvider from "contexts/UserProvider";

const App = () => {
  return (
    <UserProvider>
      <RenderRouter />
    </UserProvider>
  );
};

export default App;
