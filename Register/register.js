const AUTH_SERVER = "http://localhost:8085/auth/signup";

$(document).ready(function () {
  $(".register-form").submit(async function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const name = $("#name").val();
    const phoneNumber = $("#phoneNumber").val();
    const age = $("#age").val();
    const password = $("#password").val();
    const user = {
      email,
      name,
      phoneNumber,
      age,
      password,
    };
    try {
      $(".loading").show();
      $(".register-btn").addClass("disabled");
      const res = await axios.post(AUTH_SERVER, user);
      $(".user-message.user-message--error").text("")
      window.location.replace("/");
    } catch (error) {
        console.log(error.response.data)
        $(".user-message.user-message--error").text(error.response.data.message)
    } finally {
      $(".register-btn").removeClass("disabled");
      $(".loading").hide();
    }
  });
});


