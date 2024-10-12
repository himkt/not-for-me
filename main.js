const FORYOU    = 'for you';
const FOLLOWING = 'following';
const AD        = 'ad';

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

const removeAdElements = () => {
  const waitForElement = () => {
    const adElements = Array.from(document.querySelectorAll('span')).filter(
      (span) => span.textContent.trim().toLowerCase() === AD
    );
    adElements.forEach((adSpan) => {
      const adContainer = adSpan.closest('[data-testid="cellInnerDiv"]');
      if (adContainer && adContainer.style.display != 'none') {
        adContainer.style.display = 'none';
      }
    });
    requestAnimationFrame(waitForElement);
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
  removeAdElements();
};

main();
