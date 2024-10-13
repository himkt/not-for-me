const FORYOU: string = 'for you';
const FOLLOWING: string = 'following';
const AD: string = 'ad';
const TRENDS_FOR_YOU: string = 'trends for you';
const WHATS_HAPPENING: string = 'Timeline: Trending now';

const removeElementByTextContent = (text: string): void => {
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

const main = (): void => {
  clickFollowingTab();
  observeMutations();
};

main();
