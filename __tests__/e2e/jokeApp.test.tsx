import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    
    const { container } = render(
      <ToastProvider>
        <JokeApp />
      </ToastProvider>
    );
    
    // Ir a la pestaña de favoritos
    const favoritesTab = screen.getAllByRole('button')[1];
    
    await act(async () => {
      fireEvent.click(favoritesTab);
    });
    
    // Verificar que se muestran los chistes guardados
    await waitFor(() => {
      expect(screen.getByText('Joke One')).toBeInTheDocument();
      expect(screen.getByText('Joke Two')).toBeInTheDocument();
    });
    
    // Cambiar ordenamiento a "highest"
    const sortSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'highest' } });
    });
    
    // Obtener las tarjetas de chistes después del ordenamiento
    // Lo hacemos así porque podrían tener elementos anidados y el orden en getAllByText
    // no sería confiable
    const jokeCards = container.querySelectorAll('.bg-gray-800.rounded-lg.p-4');
    await waitFor(() => {
      expect(jokeCards[0].textContent).toContain('Joke Two'); // rating 4
      expect(jokeCards[1].textContent).toContain('Joke One'); // rating 2
    });
  });
});
