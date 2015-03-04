require.config({
	paths: {
		jquery:"jquery-1.11.1"
	}
})

require(["jquery"],function($) {
	$(function() {
		var arr=[];
		var left_number=0;
		var right_number=0;
		$.each($(".wrap > div"),function(i) {
			var opacity=$(this).css("opacity");
			var num = new Number(opacity);
			arr.push( [$(this).position().left,$(this).position().top,$(this).width(),$(this).height(),num.toFixed(1),$(this).css("z-index")] );//,$(this).width(),$(this).height(),$(this).css("opacity")]);
		})

		$(".left").click(function() {
			arr.push(arr[0]);
			arr.shift();

			$.each($(".wrap > div"),function(i) {
				$(this).css("z-index",arr[i][5]);
				$(this).animate({"left":arr[i][0],"top":arr[i][1],"opacity":arr[i][4],"width":arr[i][2],"height":arr[i][3]},"normal","swing");
			})
		})

		$(".right").click(function() {
			arr.unshift(arr[arr.length-1]);
			arr.pop();
	
			$.each($(".wrap > div"),function(i) {
				$(this).css("z-index",arr[i][5]);
				$(this).animate({"left":arr[i][0],"top":arr[i][1],"opacity":arr[i][4],"width":arr[i][2],"height":arr[i][3]},"normal","swing");
			})
		})
	})
})