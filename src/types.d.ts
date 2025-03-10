declare namespace NodeJS {
  interface Global {
    MutationObserver: typeof MutationObserver;
  }
}

interface HTMLElement {
  style: CSSStyleDeclaration;
  textContent: string | null;
  closest<T extends HTMLElement>(selector: string): T | null;
}
