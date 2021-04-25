const AUTH_SERVER = "http://localhost:8085/auth/user";

$(document).ready(function () {
  $(".update-profile").submit(async function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const name = $("#name").val();
    const phoneNumber = $("#phoneNumber").val();
    const password = $("#password").val();
    const user = {
      email,
      name,
      phoneNumber,
      password,
    };
    try {
      $(".loading").show();
      $(".btn-update").addClass("disabled");
      const res = await axios.put(AUTH_SERVER, user);

      // update token
      localStorage.setItem("token", res.data.token);

      // update user info
      const decoded = jwt_decode(res.data.token);
      $(".username").text(decoded.name);
      $(".useremail").text(decoded.email);
      $(".usernumber").text("phone : " + decoded.phoneNumber);

      $(".user-message.user-message--error").text("");
      $(".confirm-message").text("Info Updated");
      setTimeout(() => {
        $(".confirm-message").text("");
      }, 2000);
    } catch (error) {
      $(".user-message.user-message--error").text(error.response.data.message);
    } finally {
      $(".btn-update").removeClass("disabled");
      $(".loading").hide();
    }
  })
})