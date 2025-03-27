import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '@/hooks/useFavorites';
import { ToastProvider } from '@/contexts/toast-context';
import { ReactNode } from 'react';

// Mock de localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Wrapper para el contexto de toast
const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useFavorites Hook', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  test('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.favorites).toEqual([]);
  });

  test('should load favorites from localStorage', () => {
    const mockJokes = [
      { id: '1', value: 'Test joke 1', icon_url: 'test.png', rating: 3 }
    ];
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockJokes));

    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.favorites).toEqual(mockJokes);
  });

  test('should add a joke to favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const newJoke = { id: '2', value: 'Test joke 2', icon_url: 'test.png' };
    
    act(() => {
      result.current.addToFavorites(newJoke);
    });
    
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe('2');
    expect(result.current.favorites[0].rating).toBe(0);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  test('should not add duplicate jokes', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const joke = { id: '3', value: 'Test joke 3', icon_url: 'test.png' };
    
    act(() => {
      result.current.addToFavorites(joke);
      // Intento agregar el mismo chiste nuevamente
      result.current.addToFavorites(joke);
    });
    
    expect(result.current.favorites).toHaveLength(1);
  });

  test('should remove a joke from favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const joke = { id: '4', value: 'Test joke 4', icon_url: 'test.png' };
    
    act(() => {
      result.current.addToFavorites(joke);
    });
    
    expect(result.current.favorites).toHaveLength(1);
    
    act(() => {
      result.current.removeFromFavorites('4');
    });
    
    expect(result.current.favorites).toHaveLength(0);
  });

  test('should update a joke rating', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const joke = { id: '5', value: 'Test joke 5', icon_url: 'test.png' };
    
    act(() => {
      result.current.addToFavorites(joke);
    });
    
    act(() => {
      result.current.updateRating('5', 4);
    });
    
    expect(result.current.favorites[0].rating).toBe(4);
  });
});
