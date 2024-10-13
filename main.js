const FORYOU = 'for you';
const FOLLOWING = 'following';
const AD = 'ad';
const TRENDS_FOR_YOU = 'trends for you';
const WHATS_HAPPENING = 'timeline: trending now';

const removeElementByTextContent = (selector, text, closestSelector) => {
  const elements = Array.from(document.querySelectorAll(selector)).filter(
    (el) => el.textContent.trim().toLowerCase() === text
  );
  elements.forEach((element) => {
    const container = element.closest(closestSelector);
    if (container && container.style.display != 'none') {
      container.style.display = 'none';
    }
  });
};

const removeElementByAriaLabel = (ariaLabel) => {
  const element = document.querySelector(`[aria-label="${ariaLabel}"]`);
  if (element) {
    element.style.display = 'none';
  }
};

const removeForYouTab = (tab) => {
  if (!tab) return;
  const forYouTab = Array.from(tab.childNodes).find(
    (node) => node.textContent.trim().toLowerCase() === FORYOU
  );
  if (forYouTab) {
    forYouTab.style.display = 'none';
  }
};

const clickFollowingTab = () => {
  const followingTab = Array.from(document.querySelectorAll('a[role="tab"]')).find(
    (tab) => tab.textContent.trim().toLowerCase() === FOLLOWING
  );
  if (followingTab) {
    followingTab.click();
  } else {
    requestAnimationFrame(clickFollowingTab);
  }
};

const observeMutations = () => {
  let mutationTimeout;
  const observer = new MutationObserver(() => {
    if (mutationTimeout) clearTimeout(mutationTimeout);
    mutationTimeout = setTimeout(() => {
      const tablists = document.querySelectorAll('[role=tablist]');
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

const main = () => {
  clickFollowingTab();
  observeMutations();
};

main();
