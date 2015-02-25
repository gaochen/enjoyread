require.config({
	paths: {
		jquery:"jquery-1.11.1"
	}
})

require(["jquery"],function($) {
	$(function() {
		$(".logout").click(function() {
			$.get("logout",function() {
				
			})
		})
	})
})