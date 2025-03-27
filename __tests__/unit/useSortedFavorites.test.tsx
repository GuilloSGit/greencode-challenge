import { renderHook, act } from '@testing-library/react';
import { useSortedFavorites } from '@/hooks/useSortedFavorites';
import type { Joke } from '@/lib/types';

describe('useSortedFavorites Hook', () => {
  const mockJokes: Joke[] = [
    { id: '1', value: 'Joke 1', icon_url: 'test1.png', rating: 3 },
    { id: '2', value: 'Joke 2', icon_url: 'test2.png', rating: 5 },
    { id: '3', value: 'Joke 3', icon_url: 'test3.png', rating: 1 },
    { id: '4', value: 'Joke 4', icon_url: 'test4.png', rating: 4 },
  ];

  test('should initialize with "newest" sort option', () => {
    const { result } = renderHook(() => useSortedFavorites(mockJokes));
    
    expect(result.current.sortBy).toBe('newest');
    // En 'newest', debería mantener el orden original
    expect(result.current.sortedFavorites).toEqual(mockJokes);
  });

  test('should sort by highest rating', () => {
    const { result } = renderHook(() => useSortedFavorites(mockJokes));
    
    act(() => {
      result.current.setSortBy('highest');
    });
    
    expect(result.current.sortBy).toBe('highest');
    
    // Verificar que los chistes estén ordenados de mayor a menor rating
    expect(result.current.sortedFavorites[0].id).toBe('2'); // rating 5
    expect(result.current.sortedFavorites[1].id).toBe('4'); // rating 4
    expect(result.current.sortedFavorites[2].id).toBe('1'); // rating 3
    expect(result.current.sortedFavorites[3].id).toBe('3'); // rating 1
  });

  test('should sort by lowest rating', () => {
    const { result } = renderHook(() => useSortedFavorites(mockJokes));
    
    act(() => {
      result.current.setSortBy('lowest');
    });
    
    expect(result.current.sortBy).toBe('lowest');
    
    // Verificar que los chistes estén ordenados de menor a mayor rating
    expect(result.current.sortedFavorites[0].id).toBe('3'); // rating 1
    expect(result.current.sortedFavorites[1].id).toBe('1'); // rating 3
    expect(result.current.sortedFavorites[2].id).toBe('4'); // rating 4
    expect(result.current.sortedFavorites[3].id).toBe('2'); // rating 5
  });

  test('should handle empty favorites array', () => {
    const { result } = renderHook(() => useSortedFavorites([]));
    
    expect(result.current.sortedFavorites).toEqual([]);
    
    // Cambiar la opción de ordenamiento no debería arrojar errores con un array vacío
    act(() => {
      result.current.setSortBy('highest');
    });
    
    expect(result.current.sortedFavorites).toEqual([]);
  });

  test('should update sorted favorites when input jokes change', () => {
    const { result, rerender } = renderHook(
      (props) => useSortedFavorites(props.jokes), 
      { initialProps: { jokes: mockJokes.slice(0, 2) } }
    );
    
    expect(result.current.sortedFavorites).toHaveLength(2);
    
    // Simular la adición de más chistes
    rerender({ jokes: mockJokes });
    
    expect(result.current.sortedFavorites).toHaveLength(4);
  });
});
