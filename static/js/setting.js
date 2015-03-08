require.config({
	paths: {
		jquery:"jquery-1.11.1"
	}
})

require(["jquery"],function($) {
	$(function() {
		$(".newPsw_input").eq(0).blur(function() {
			if($(this).val().length<6 || $(this).val().lenght>12) {
				$(".change_error").eq(1).text("密码格式不对");
			}
			else {
				$(".change_error").eq(1).text("");
			}
		})
		$(".newPsw_input").eq(1).blur(function() {
			if($(this).val()!=$(".newPsw_input").eq(0).val()) {
				$(".change_error").eq(2).text("两次输入的密码不一致");
			}
			else {
				$(".change_error").eq(2).text("");
			}
		})

		$(".change_password_btn").click(function() {
			if($(".change_error").text()=="") {
				switch (true) {
					case $(".present_input").val()=="":
						$(".change_error").eq(0).text("请填写原密码");
						break;
					case $(".newPsw_input").eq(0).val()=="":
						$(".change_error").eq(1).text("请填写新密码");
						break;
					case $(".newPsw_input").eq(1).val()=="":
						$(".change_error").eq(2).text("请再次填写新密码");
						break;
					default:
						var oldPsw = $(".present_input").val();
						var newPsw = $(".newPsw_input").eq(0).val();
						$.post("/user/changepassword",{"oldpassword":oldPsw,"newpassword":newPsw},function(data) {
							//alert(1);
						},"json")
				}
			}
		})

		//获取标签值
		$.get("rss",function(data) {
			$.each(data,function(i) {
				var oLi=$('<li><input type="checkbox" id='+data[i].id+' /><label for='+data[i].id+'>'+data[i].name+'</label><img src='+data[i].picture+' /></li>').appendTo($(".change_checkbox"));
			})
		},"json")

	})
})