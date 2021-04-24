$(document).ready( function () {

  const tokenn = localStorage.getItem("token");
  if (tokenn) {
    const decoded = jwt_decode(tokenn);
    $(".username").text(decoded.name);
    $(".useremail").text(decoded.email);
    $(".usernumber").text("phone : " + decoded.phoneNumber);
  }

  axios.defaults.headers.common["Authorization"] = "Bearer " + tokenn;

})
$(document).ready(function () {
  $(".logout").click(() => {
    localStorage.removeItem("token");
  });
});
