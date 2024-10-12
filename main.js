const FORYOU = 'for you';
const FOLLOWING = 'following';
const AD = 'ad';
const TRENDS_FOR_YOU = 'trends for you';

const removeElementByTextContent = (selector, text, closestSelector) => {
  const waitForElement = () => {
    const elements = Array.from(document.querySelectorAll(selector)).filter(
      (el) => el.textContent.trim().toLowerCase() === text
    );
    elements.forEach((element) => {
      const container = element.closest(closestSelector);
      if (container && container.style.display != 'none') {
        container.style.display = 'none';
      }
    });
    requestAnimationFrame(waitForElement);
  };
  waitForElement();
};

const removeForYouTab = (tab) => {
  if (!tab) return;
  const forYouTab = Array.from(tab.childNodes).find(
    (node) => node.textContent.trim().toLowerCase() === FORYOU
  );
  if (forYouTab) {
    tab.removeChild(forYouTab);
  }
};

const removeWhatsHappeningSection = () => {
  const waitForElement = () => {
    const whatsHappeningSection = document.querySelector('[aria-label="Timeline: Trending now"]');
    if (whatsHappeningSection) {
      whatsHappeningSection.remove();
    } else {
      requestAnimationFrame(waitForElement);
    }
  };
  waitForElement();
};

const clickFollowingTab = () => {
  const waitForElement = () => {
    const followingTab = Array.from(document.querySelectorAll('a[role="tab"]')).find(
      (tab) => tab.textContent.trim().toLowerCase() === FOLLOWING
    );
    if (followingTab) {
      followingTab.click();
    } else {
      requestAnimationFrame(waitForElement);
    }
  };
  waitForElement();
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
    }, 100);
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
};

const main = () => {
  clickFollowingTab();
  observeMutations();
  removeWhatsHappeningSection();
  removeElementByTextContent('span', AD, '[data-testid="cellInnerDiv"]');
  removeElementByTextContent('span', TRENDS_FOR_YOU, '[data-testid="cellInnerDiv"]');
};

main();
