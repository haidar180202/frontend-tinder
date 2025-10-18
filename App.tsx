import React from 'react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainScreen from './src/screens/MainScreen';

const queryClient = new QueryClient();

export default function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <MainScreen />
      </QueryClientProvider>
    </RecoilRoot>
  );
}