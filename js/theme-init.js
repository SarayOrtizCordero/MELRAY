(function () {
  try {
    if (localStorage.getItem('melray-theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
})();
