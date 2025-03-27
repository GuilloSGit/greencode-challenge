/// <reference types="jest" />
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      // Agregar otros matchers personalizados de testing-library aquí según sea necesario
    }
  }
}
