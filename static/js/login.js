require.config({
	paths: {
		jquery:"jquery-1.11.1"
	}
})

require(["jquery"],function($) {
	$(function() {
		$(".login_btn").click(function() {

			var email=$(".email_input").val();
			var password=$(".password_input").val();
			$.post("login",{"email":email,"password":password},function(data) {
				switch(data.code) {
					case 10001 :
						$(".email_error").text("邮箱或密码格式错误");
						break;
					case 10003:
						$(".password_error").text("邮箱或密码错误");
						break;
					case 0 :
						location.href="/";
				}
			},"json")
		})
	})
})