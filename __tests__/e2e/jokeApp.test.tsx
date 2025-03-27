import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { act } from 'react'; 
import JokeApp from '@/components/joke-app';
import { fetchRandomJoke } from '@/lib/api';
import { ToastProvider } from '@/contexts/toast-context';

// Mock localStorage
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

// Mock de la API
jest.mock('@/lib/api', () => ({
  fetchRandomJoke: jest.fn()
}));

const mockFetchRandomJoke = fetchRandomJoke as jest.MockedFunction<typeof fetchRandomJoke>;

// Mock para SVG Icons
jest.mock('@/components/SVG/HeartIcon', () => ({
  __esModule: true,
  default: () => <div data-testid="heart-icon">♥</div>
}));

jest.mock('@/components/SVG/NewJokeIcon', () => ({
  __esModule: true,
  default: () => <div data-testid="new-joke-icon">↻</div>
}));

jest.mock('@/components/SVG/StarIcon', () => ({
  __esModule: true,
  default: () => <div data-testid="star-icon">★</div>
}));

jest.mock('@/components/SVG/TrashIcon', () => ({
  __esModule: true,
  default: () => <div data-testid="trash-icon">🗑</div>
}));

describe('JokeApp End-to-End', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
    
    // Configure mock for random joke
    mockFetchRandomJoke.mockImplementation(() => 
      Promise.resolve({ id: 'joke-id', value: 'Test Chuck Norris joke', icon_url: 'test.png' })
    );
  });

  test('should fetch and display a random joke', async () => {
    render(
      <ToastProvider>
        <JokeApp />
      </ToastProvider>
    );
    
    // Esperar a que se cargue el chiste
    await waitFor(() => {
      expect(screen.getByText('Test Chuck Norris joke')).toBeInTheDocument();
    });
    
    // Verificar que se haya llamado a fetchRandomJoke
    expect(mockFetchRandomJoke).toHaveBeenCalledTimes(1);
  });

  test('should add a joke to favorites', async () => {
    render(
      <ToastProvider>
        <JokeApp />
      </ToastProvider>
    );
    
    // Esperar a que se cargue el chiste
    await waitFor(() => {
      expect(screen.getByText('Test Chuck Norris joke')).toBeInTheDocument();
    });
    
    // Añadir a favoritos - usamos un selector más específico
    const addToFavoritesButton = screen.getByTestId("heart-icon").closest("button");
    
    if (!addToFavoritesButton) {
      throw new Error('Add to favorites button not found');
    }
    
    await act(async () => {
      fireEvent.click(addToFavoritesButton);
    });
    
    // Verificar que se actualiza LocalStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    
    // Ir a la pestaña de favoritos - usamos el segundo botón de la navegación
    const favoritesTab = screen.getAllByRole('button')[1]; 
    
    await act(async () => {
      fireEvent.click(favoritesTab);
    });
    
    // Verificar que el chiste está en la lista de favoritos
    await waitFor(() => {
      expect(screen.getByText('Test Chuck Norris joke')).toBeInTheDocument();
    });
  });

  test('should fetch a new joke when clicking new joke button', async () => {
    // Setup segunda llamada a la API
    mockFetchRandomJoke.mockImplementationOnce(() => 
      Promise.resolve({ id: 'joke-id-1', value: 'First joke', icon_url: 'test.png' })
    ).mockImplementationOnce(() => 
      Promise.resolve({ id: 'joke-id-2', value: 'Second joke', icon_url: 'test.png' })
    );
    
    render(
      <ToastProvider>
        <JokeApp />
      </ToastProvider>
    );
    
    // Esperar al primer chiste
    await waitFor(() => {
      expect(screen.getByText('First joke')).toBeInTheDocument();
    });
    
    // Pedir nuevo chiste usando el testid
    const newJokeButton = screen.getByTestId("new-joke-icon").closest("button");
    
    if (!newJokeButton) {
      throw new Error('New joke button not found');
    }
    
    await act(async () => {
      fireEvent.click(newJokeButton);
    });
    
    // Esperar al segundo chiste
    await waitFor(() => {
      expect(screen.getByText('Second joke')).toBeInTheDocument();
    });
    
    // Verificar que fetchRandomJoke se llamó dos veces
    expect(mockFetchRandomJoke).toHaveBeenCalledTimes(2);
  });

  test('should rate and sort jokes in favorites', async () => {
    // Preparar localStorage con chistes guardados
    const savedJokes = [
      { id: 'joke1', value: 'Joke One', icon_url: 'test1.png', rating: 2 },
      { id: 'joke2', value: 'Joke Two', icon_url: 'test2.png', rating: 4 }
    ];
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedJokes));
    
    render(
      <ToastProvider>
        <JokeApp />
      </ToastProvider>
    );
    
    // Ir a la pestaña de favoritos
    const favoritesTab = screen.getByRole('tab', { name: /favorites/i });
    
    await act(async () => {
      fireEvent.click(favoritesTab);
    });
    
    // Verificar que se muestran los chistes guardados
    await waitFor(() => {
      // Usar una consulta más flexible para encontrar el texto
      const jokeOneElement = screen.getByText((content, element) => {
        return content.includes('Joke One');
      });
      const jokeTwoElement = screen.getByText((content, element) => {
        return content.includes('Joke Two');
      });
      
      expect(jokeOneElement).toBeInTheDocument();
      expect(jokeTwoElement).toBeInTheDocument();
    });
    
    // Cambiar ordenamiento a "highest"
    const sortSelect = screen.getByLabelText(/sort favorites by/i);
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'highest' } });
    });
    
    // Verificar que los chistes se hayan reordenado
    const jokesAfterSort = screen.getAllByRole('listitem');
    expect(jokesAfterSort.length).toBe(2);
    
    // Verificar que Joke Two (rating 4) aparece primero que Joke One (rating 2)
    const jokesText = jokesAfterSort.map(joke => joke.textContent);
    
    expect(jokesText[0]).toContain('Joke Two');
    expect(jokesText[1]).toContain('Joke One');
    
    // Valorar Joke One con 5 estrellas
    const jokeOneElement = screen.getByText((content, element) => {
      return content.includes('Joke One');
    }).closest('div[role="listitem"]');
    
    if (!jokeOneElement) {
      throw new Error('Joke One container not found');
    }
    
    const jokeOneRatingButtons = within(jokeOneElement as HTMLElement).getAllByRole('button').filter((btn: HTMLElement) => 
      btn.getAttribute('aria-label')?.includes('Rate')
    );
    
    // Hacer clic en el quinto botón (5 estrellas)
    await act(async () => {
      fireEvent.click(jokeOneRatingButtons[4]);
    });
    
    // Verificar que se ha actualizado la clasificación en localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });
});
