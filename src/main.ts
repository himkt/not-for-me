const FORYOU: string = 'for you';
const FOLLOWING: string = 'following';
const AD: string = 'ad';
const TRENDS_FOR_YOU: string = 'trends for you';
const WHATS_HAPPENING: string = 'timeline: trending now';

const removeElementByTextContent = (selector: string, text: string, closestSelector: string): void => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.textContent?.trim().toLowerCase() === text
  );
  elements.forEach((element) => {
    const container = element.closest<HTMLElement>(closestSelector);
    if (container && container.style.display != 'none') {
      container.style.display = 'none';
    }
  });
};

const removeElementByAriaLabel = (ariaLabel: string): void => {
  const element = document.querySelector<HTMLElement>(`[aria-label="${ariaLabel}"]`);
  if (element) {
    element.style.display = 'none';
  }
};

const removeForYouTab = (tab: HTMLElement | null): void => {
  if (!tab) return;
  const forYouTab = Array.from(tab.childNodes).find(
    (node) => (node as HTMLElement).textContent?.trim().toLowerCase() === FORYOU
  ) as HTMLElement | undefined;
  if (forYouTab) {
    forYouTab.style.display = 'none';
  }
};

const clickFollowingTab = (): void => {
  const followingTab = Array.from(document.querySelectorAll<HTMLElement>('a[role="tab"]')).find(
    (tab) => tab.textContent?.trim().toLowerCase() === FOLLOWING
  );
  if (followingTab) {
    followingTab.click();
  } else {
    requestAnimationFrame(clickFollowingTab);
  }
};

const observeMutations = (): void => {
  let mutationTimeout: number;
  const observer = new MutationObserver(() => {
    if (mutationTimeout) clearTimeout(mutationTimeout);
    mutationTimeout = window.setTimeout(() => {
      const tablists = document.querySelectorAll<HTMLElement>('[role=tablist]');
      if (tablists.length < 2) return;

      const targetTab = tablists[0];
      if (targetTab.childNodes.length < 2) return;

      removeForYouTab(targetTab);
      removeElementByAriaLabel('Timeline: Trending now');
      removeElementByTextContent('span', AD, '[data-testid="cellInnerDiv"]');
      removeElementByTextContent('span', TRENDS_FOR_YOU, '[data-testid="cellInnerDiv"]');
    }, 100);
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
};

const main = (): void => {
  clickFollowingTab();
  observeMutations();
};

main();
