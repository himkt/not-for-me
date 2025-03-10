export const FORYOU: string = 'for you';
export const FOLLOWING: string = 'following';
export const AD: string = 'ad';
export const TRENDS_FOR_YOU: string = 'trends for you';
export const WHATS_HAPPENING: string = 'Timeline: Trending now';

export const removeElementByTextContent = (text: string): void => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('span')).filter(
    (el) => el.textContent?.trim().toLowerCase() === text
  );
  elements.forEach((element) => {
    const container = element.closest<HTMLElement>('[data-testid="cellInnerDiv"]');
    if (container && container.style.display != 'none') {
      container.style.display = 'none';
    }
  });
};

export const removeElementByAriaLabel = (ariaLabel: string): void => {
  const element = document.querySelector<HTMLElement>(`[aria-label="${ariaLabel}"]`);
  if (element) {
    element.style.display = 'none';
  }
};

export const removeForYouTab = (tab: HTMLElement | null): void => {
  if (!tab) return;
  const forYouTab = Array.from(tab.childNodes).find(
    (node) => (node as HTMLElement).textContent?.trim().toLowerCase() === FORYOU
  ) as HTMLElement | undefined;
  if (forYouTab) {
    forYouTab.style.display = 'none';
  }
};

export const clickFollowingTab = (): void => {
  const followingTab = Array.from(document.querySelectorAll<HTMLElement>('a[role="tab"]')).find(
    (tab) => tab.textContent?.trim().toLowerCase() === FOLLOWING
  );
  if (followingTab) {
    followingTab.click();
  } else {
    requestAnimationFrame(clickFollowingTab);
  }
};

export const observeMutations = (): void => {
  const observer = new MutationObserver(() => {
    const tabList = document.querySelectorAll<HTMLElement>('[role=tablist]');
    removeForYouTab(tabList[0]);
    removeElementByAriaLabel(WHATS_HAPPENING);
    removeElementByTextContent(AD);
    removeElementByTextContent(TRENDS_FOR_YOU);
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
};

export const main = (): void => {
  clickFollowingTab();
  observeMutations();
};

main();
