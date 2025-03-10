// Global type declarations for the project

// Declare global variables used in tests
declare namespace NodeJS {
  interface Global {
    MutationObserver: typeof MutationObserver;
  }
}

// Extend the HTMLElement interface to ensure style property is recognized
interface HTMLElement {
  style: CSSStyleDeclaration;
  textContent: string | null;
  closest<T extends HTMLElement>(selector: string): T | null;
}
