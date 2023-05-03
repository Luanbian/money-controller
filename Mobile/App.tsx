import React from 'react';
import Routes from './src/routes/routes';
import { SWRConfig } from 'swr';
import axios from 'axios';

// Config global SWR
export default function App() {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (url: string) => axios.get(url).then((res) => res.data.data),
      }}
    >
      <Routes />
    </SWRConfig>
  );
}
