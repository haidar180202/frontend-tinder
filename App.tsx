import React, { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/store/AuthContext';

const queryClient = new QueryClient();

const App = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;