import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  FORYOU,
  WHATS_HAPPENING,
  removeElementByTextContent,
  removeElementByAriaLabel,
  removeForYouTab,
  clickFollowingTab,
  observeMutations,
  main
} from '../src/main';

describe('Not For Me Extension', () => {
  // Setup and teardown
  beforeEach(() => {
    // Create a fresh DOM environment for each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  describe('removeElementByTextContent', () => {
    it('should hide elements with matching text content', () => {
      // Setup
      document.body.innerHTML = `
        <div data-testid="cellInnerDiv">
          <span>For you</span>
        </div>
        <div data-testid="cellInnerDiv">
          <span>Something else</span>
        </div>
      `;

      // Execute
      removeElementByTextContent(FORYOU);

      // Assert
      const elements = document.querySelectorAll<HTMLElement>('[data-testid="cellInnerDiv"]');
      expect(elements[0].style.display).toBe('none');
      expect(elements[1].style.display).not.toBe('none');
    });

    it('should handle case insensitivity', () => {
      // Setup
      document.body.innerHTML = `
        <div data-testid="cellInnerDiv">
          <span>FOR YOU</span>
        </div>
      `;

      // Execute
      removeElementByTextContent(FORYOU);

      // Assert
      const element = document.querySelector<HTMLElement>('[data-testid="cellInnerDiv"]');
      expect(element?.style.display).toBe('none');
    });

    it('should handle whitespace in text content', () => {
      // Setup
      document.body.innerHTML = `
        <div data-testid="cellInnerDiv">
          <span>  for you  </span>
        </div>
      `;

      // Execute
      removeElementByTextContent(FORYOU);

      // Assert
      const element = document.querySelector<HTMLElement>('[data-testid="cellInnerDiv"]');
      expect(element?.style.display).toBe('none');
    });

    it('should not modify elements that are already hidden', () => {
      // Setup
      document.body.innerHTML = `
        <div data-testid="cellInnerDiv" style="display: none;">
          <span>For you</span>
        </div>
      `;

      // Spy on style.display setter
      const element = document.querySelector<HTMLElement>('[data-testid="cellInnerDiv"]');
      const spy = vi.spyOn(element!.style, 'display', 'set');

      // Execute
      removeElementByTextContent(FORYOU);

      // Assert - the style should not be modified again
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('removeElementByAriaLabel', () => {
    it('should hide element with matching aria-label', () => {
      // Setup
      document.body.innerHTML = `
        <div aria-label="${WHATS_HAPPENING}">Trending content</div>
        <div aria-label="Something else">Other content</div>
      `;

      // Execute
      removeElementByAriaLabel(WHATS_HAPPENING);

      // Assert
      const elements = document.querySelectorAll<HTMLElement>('div');
      expect(elements[0].style.display).toBe('none');
      expect(elements[1].style.display).not.toBe('none');
    });

    it('should do nothing if no element with matching aria-label is found', () => {
      // Setup
      document.body.innerHTML = `
        <div aria-label="Something else">Other content</div>
      `;

      // Execute - should not throw
      expect(() => {
        removeElementByAriaLabel('Non-existent label');
      }).not.toThrow();
    });
  });

  describe('removeForYouTab', () => {
    it('should hide the For You tab', () => {
      // Setup
      document.body.innerHTML = `
        <div role="tablist">
          <div>For you</div>
          <div>Following</div>
        </div>
      `;

      // Execute
      const tabList = document.querySelector<HTMLElement>('[role="tablist"]');
      removeForYouTab(tabList);

      // Assert
      const forYouTab = Array.from(tabList!.childNodes).find(
        (node) => (node as HTMLElement).textContent?.trim().toLowerCase() === FORYOU
      ) as HTMLElement;

      expect(forYouTab.style.display).toBe('none');
    });

    it('should do nothing if tab is null', () => {
      // Execute - should not throw
      expect(() => {
        removeForYouTab(null);
      }).not.toThrow();
    });

    it('should do nothing if For You tab is not found', () => {
      // Setup
      document.body.innerHTML = `
        <div role="tablist">
          <div>Following</div>
          <div>Other tab</div>
        </div>
      `;

      // Execute
      const tabList = document.querySelector<HTMLElement>('[role="tablist"]');
      removeForYouTab(tabList);

      // Assert - no errors should be thrown
      // Just verify the test doesn't throw an error
      expect(true).toBe(true);
    });
  });

  describe('clickFollowingTab', () => {
    it('should click the Following tab if found', () => {
      // Setup
      document.body.innerHTML = `
        <a role="tab">For you</a>
        <a role="tab">Following</a>
      `;

      // Mock the click method
      const followingTab = document.querySelectorAll<HTMLElement>('a[role="tab"]')[1];
      const clickSpy = vi.spyOn(followingTab, 'click' as any);

      // Execute
      clickFollowingTab();

      // Assert
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should use requestAnimationFrame if Following tab is not found', () => {
      // Setup
      document.body.innerHTML = `
        <a role="tab">For you</a>
        <a role="tab">Something else</a>
      `;

      // Mock requestAnimationFrame
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

      // Execute
      clickFollowingTab();

      // Assert
      expect(rafSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('observeMutations', () => {
    it('should set up a MutationObserver on the document body', () => {
      // Mock MutationObserver
      const observeSpy = vi.fn();
      window.MutationObserver = vi.fn().mockImplementation(() => ({
        observe: observeSpy,
        disconnect: vi.fn(),
      }));

      // Execute
      observeMutations();

      // Assert
      expect(window.MutationObserver).toHaveBeenCalled();
      expect(observeSpy).toHaveBeenCalledWith(document.body, { childList: true, subtree: true });
    });

    it('should be defined and callable', () => {
      // Mock MutationObserver to prevent errors
      window.MutationObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
      }));

      // Assert that the function exists and can be called without errors
      expect(observeMutations).toBeDefined();
      expect(() => observeMutations()).not.toThrow();
    });
  });

  describe('main', () => {
    it('should be defined and callable', () => {
      // Mock MutationObserver to prevent errors
      window.MutationObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
      }));

      // Mock requestAnimationFrame to prevent infinite loop
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation(vi.fn());

      // Assert that the function exists and can be called without errors
      expect(main).toBeDefined();
      expect(() => main()).not.toThrow();
    });
  });
});
