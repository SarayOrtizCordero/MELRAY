(function () {
  var root = document.documentElement;
  // Cada página puede fijar su tema por defecto (data-default-theme) y su
  // propia clave de preferencia (data-theme-key). Si la persona ya eligió un
  // tema en esa página, se respeta; si no, se usa el predeterminado.
  var fallback = root.getAttribute('data-default-theme') === 'dark' ? 'dark' : 'light';
  var key = root.getAttribute('data-theme-key') || 'melray-theme';
  var saved = null;
  try { saved = localStorage.getItem(key); } catch (e) {}
  if ((saved || fallback) === 'dark') root.setAttribute('data-theme', 'dark');
})();
