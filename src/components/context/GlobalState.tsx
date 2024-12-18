import { UsuarioDTO } from 'data/interfaces/UserDTO';
import { createContext, useReducer, useContext, ReactNode } from 'react';

// Definir el tipo de datos del estado
interface State {
  user: UsuarioDTO | null;
  tokenJWT: string | null;
}

// Definir el estado inicial
const initialState: State = {
  // estado para el usuario
  user: null,
  tokenJWT: null,
};
// Define action types
type Action =
  | { type: 'SET_USER'; payload: { user: UsuarioDTO; tokenJWT: string } }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'LOGIN'; payload: { tokenJWT: string }}

// Definir las acciones
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        tokenJWT: action.payload.tokenJWT,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        tokenJWT: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokenJWT: null,
      };
    case 'LOGIN':
      return {
        ...state,
        tokenJWT: action.payload.tokenJWT
      }
    default:
      return state;
  }
};


// Definir el tipo del contexto
interface GlobalStateType {
  state: typeof initialState;
  dispatch: React.Dispatch<any>;
}

// Crear el contexto
const GlobalStateContext = createContext<GlobalStateType | undefined>(undefined);

// Crear el proveedor del contexto
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Crear un hook para usar el contexto
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState debe ser usado dentro de un GlobalStateProvider');
  }
  return context;
};
