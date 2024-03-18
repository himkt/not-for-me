const main = (tab) => {
  const element = tab.childNodes[0];
  tab.removeChild(element);
}

const wait = () => {
  const observer = new MutationObserver((mutationList, observer) => {
    let tablist = document.querySelectorAll("[role=tablist]");
    if (!tablist) return;
    if (tablist.length != 2) return;

    let target_tab = tablist[0];
    if (target_tab.childNodes.length < 2) return;

    main(target_tab);
    observer.disconnect();
  });

  const config = { childList: true };
  observer.observe(document.body, config);
};

wait();
