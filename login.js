const AUTH_SERVER = "http://localhost:8085/auth/login";
$(document).ready(function () {
    $(".login-form").submit(async function (e) {
      e.preventDefault();
      const email = $("#email").val();
      const password = $("#password").val();
      const user = {
        email,
        password,
      };
      try {
        $(".loading").show();
        console.log(user)
        $(".login-btn").addClass("disabled");
        const res = await axios.post(AUTH_SERVER, user);
        console.log(res)
        $(".user-message.user-message--error").text("")
        localStorage.setItem("token",res.data.token)
        window.location.replace("/profile");
    } catch (error) {
        console.log(error.response.data)
        $(".user-message.user-message--error").text(error.response.data.message)
    } finally {
        $(".login-btn").removeClass("disabled");
        $(".loading").hide();
    }
});
});

