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
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('removeElementByTextContent', () => {
    it('should hide elements with matching text content', () => {
      document.body.innerHTML = `
        <div data-testid="cellInnerDiv">
          <span>For you</span>
        </div>
        <div data-testid="cellInnerDiv">
          <span>Something else</span>
        </div>
      `;

      removeElementByTextContent(FORYOU);

      const elements = document.querySelectorAll<HTMLElement>('[data-testid="cellInnerDiv"]');
      expect(elements[0].style.display).toBe('none');
      expect(elements[1].style.display).not.toBe('none');
    });

    it('should handle case insensitivity', () => {
      document.body.innerHTML = `
        <div data-testid="cellInnerDiv">
          <span>FOR YOU</span>
        </div>
      `;

      removeElementByTextContent(FORYOU);

      const element = document.querySelector<HTMLElement>('[data-testid="cellInnerDiv"]');
      expect(element?.style.display).toBe('none');
    });

    it('should handle whitespace in text content', () => {
      document.body.innerHTML = `
        <div data-testid="cellInnerDiv">
          <span>  for you  </span>
        </div>
      `;

      removeElementByTextContent(FORYOU);

      const element = document.querySelector<HTMLElement>('[data-testid="cellInnerDiv"]');
      expect(element?.style.display).toBe('none');
    });

    it('should not modify elements that are already hidden', () => {
      document.body.innerHTML = `
        <div data-testid="cellInnerDiv" style="display: none;">
          <span>For you</span>
        </div>
      `;

      const element = document.querySelector<HTMLElement>('[data-testid="cellInnerDiv"]');
      const spy = vi.spyOn(element!.style, 'display', 'set');

      removeElementByTextContent(FORYOU);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('removeElementByAriaLabel', () => {
    it('should hide element with matching aria-label', () => {
      document.body.innerHTML = `
        <div aria-label="${WHATS_HAPPENING}">Trending content</div>
        <div aria-label="Something else">Other content</div>
      `;

      removeElementByAriaLabel(WHATS_HAPPENING);

      const elements = document.querySelectorAll<HTMLElement>('div');
      expect(elements[0].style.display).toBe('none');
      expect(elements[1].style.display).not.toBe('none');
    });

    it('should do nothing if no element with matching aria-label is found', () => {
      document.body.innerHTML = `
        <div aria-label="Something else">Other content</div>
      `;

      expect(() => {
        removeElementByAriaLabel('Non-existent label');
      }).not.toThrow();
    });
  });

  describe('removeForYouTab', () => {
    it('should hide the For You tab', () => {
      document.body.innerHTML = `
        <div role="tablist">
          <div>For you</div>
          <div>Following</div>
        </div>
      `;

      const tabList = document.querySelector<HTMLElement>('[role="tablist"]');
      removeForYouTab(tabList);

      const forYouTab = Array.from(tabList!.childNodes).find(
        (node) => (node as HTMLElement).textContent?.trim().toLowerCase() === FORYOU
      ) as HTMLElement;

      expect(forYouTab.style.display).toBe('none');
    });

    it('should do nothing if tab is null', () => {
      expect(() => {
        removeForYouTab(null);
      }).not.toThrow();
    });

    it('should do nothing if For You tab is not found', () => {
      document.body.innerHTML = `
        <div role="tablist">
          <div>Following</div>
          <div>Other tab</div>
        </div>
      `;

      const tabList = document.querySelector<HTMLElement>('[role="tablist"]');

      expect(() => removeForYouTab(tabList)).not.toThrow();
    });
  });

  describe('clickFollowingTab', () => {
    it('should click the Following tab if found', () => {
      document.body.innerHTML = `
        <a role="tab">For you</a>
        <a role="tab">Following</a>
      `;

      const followingTab = document.querySelectorAll<HTMLElement>('a[role="tab"]')[1];
      const clickSpy = vi.spyOn(followingTab, 'click' as any);

      clickFollowingTab();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should use requestAnimationFrame if Following tab is not found', () => {
      document.body.innerHTML = `
        <a role="tab">For you</a>
        <a role="tab">Something else</a>
      `;

      const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

      clickFollowingTab();

      expect(rafSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('observeMutations', () => {
    it('should set up a MutationObserver on the document body', () => {
      const observeSpy = vi.fn();
      window.MutationObserver = vi.fn().mockImplementation(() => ({
        observe: observeSpy,
        disconnect: vi.fn(),
      }));

      observeMutations();

      expect(window.MutationObserver).toHaveBeenCalled();
      expect(observeSpy).toHaveBeenCalledWith(document.body, { childList: true, subtree: true });
    });
  });

  describe('main', () => {
    it('should initialize the extension', () => {
      window.MutationObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
      }));

      vi.spyOn(window, 'requestAnimationFrame').mockImplementation(vi.fn());

      expect(() => main()).not.toThrow();
    });
  });
});
