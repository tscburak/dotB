import "@mantine/core/styles.css";
import { MantineProvider, Text } from "@mantine/core";
import { theme } from "./theme";
import Home from "./pages/Home";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications/>
        <Home />
    </MantineProvider>
  );
}
