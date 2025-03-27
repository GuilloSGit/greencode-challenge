import { renderHook, act, waitFor } from '@testing-library/react';
import { useJoke } from '@/hooks/useJoke';
import { fetchRandomJoke } from '@/lib/api';
import { ToastProvider } from '@/contexts/toast-context';
import { ReactNode } from 'react';

// Mock del módulo api
jest.mock('@/lib/api', () => ({
  fetchRandomJoke: jest.fn()
}));

// Typecasting the mocked function properly
const mockFetchRandomJoke = fetchRandomJoke as jest.Mock;

// Wrapper para el contexto de toast
const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useJoke Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with loading state', () => {
    const { result } = renderHook(() => useJoke(), { wrapper });
    
    expect(result.current.loading).toBe(true);
    expect(result.current.joke).toBe(null);
  });

  test('should fetch a joke successfully', async () => {
    const mockJoke = { id: '1', value: 'Test joke', icon_url: 'test.png' };
    mockFetchRandomJoke.mockResolvedValueOnce(mockJoke);
    
    const { result } = renderHook(() => useJoke(), { wrapper });
    
    act(() => {
      result.current.getNewJoke();
    });
    
    // Verificar que fetchRandomJoke se haya llamado
    expect(mockFetchRandomJoke).toHaveBeenCalledTimes(1);
    
    // Esperar a que el estado se actualice
    await waitFor(() => {
      expect(result.current.joke).toEqual(mockJoke);
      expect(result.current.loading).toBe(false);
    });
  });

  test('should handle fetch errors', async () => {
    const error = new Error('Fetch error');
    mockFetchRandomJoke.mockRejectedValueOnce(error);
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useJoke(), { wrapper });
    
    act(() => {
      result.current.getNewJoke();
    });
    
    // Esperar a que el estado se actualice
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});
