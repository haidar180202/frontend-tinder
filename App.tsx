import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SplashScreen from "./src/screens/SplashScreen";

const queryClient = new QueryClient();

export default function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SplashScreen />
      </QueryClientProvider>
    </RecoilRoot>
  );
}