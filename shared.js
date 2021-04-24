const token = localStorage.getItem("token");
const url = window.location.pathname;
if (token && (url === "/" || url === "/Register/"))
  window.location.replace("/profile");

if (
  !token &&
  (url === "/profile/" || url === "/shop/" || url === "/favorites/")
)
  window.location.replace("/");

