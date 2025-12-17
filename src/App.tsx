import RenderRouter from "routes/index";
import UserProvider from "contexts/UserProvider";
import SettingsProvider from "contexts/SettingsProvider";

const App = () => {
  return (
    <SettingsProvider>
      <UserProvider>
        <RenderRouter />
      </UserProvider>
    </SettingsProvider>
  );
};

export default App;
