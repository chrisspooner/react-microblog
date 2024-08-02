import { createContext, useContext } from 'react';
import MicroblogApiClient from '../MicroblogApiClient';

const ApiContext = createContext();

export default function ApiProvider({ children }) {
  const api = new MicroblogApiClient();

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
//   const context = useContext(ApiContext);
//   if (context === undefined) {
//     throw new Error('useApi must be used in an ApiProvider');
//   }
  return useContext(ApiContext);
}