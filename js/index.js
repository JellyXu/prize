var runing = true
var num = 0
var t

var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
var nebPay = new NebPay();
var dappAddress = 'n1kseaxr7FhYPrHrjW6epyTWnvQ9W3DxhNQ';
var nameArr = []
var phoneArr = []
var buttonSide = $("#buttonSide")
var $name = $(".name")
var $phone = $(".phone")
var $prizeBox = $("#prizeBox")
var $joinBox = $("#joinBox")
var $addPerson = $("#addPerson")
var $reset = $("#reset")
var $getPerson = $("#getPerson")
var $btnTxt = $('#getPerson')
init()
$prizeBox.hide()
function init() {
	if (typeof (webExtensionWallet) !== "undefined") {
		$("#noExtension").hide()
		buttonSide.show()
	} else {
		buttonSide.hide()
	}
	fixList();
	timer = setInterval(function () {
		fixList();
	}, 150000);
}

$("#addPerson").click(function () {
	var name = $name.val()
	var phone = $phone.val()
	if (name == "" && phone == "") {
		alert("信息要填写完整哦~！")
		return
	}
	// 判断是否有重复的
	if ($.inArray(name, nameArr) === 1 && $.inArray(phone, phoneArr) === 1) {
		alert("该名单已经存在了")
		return
	}
	var to = dappAddress;
	var value = "0";
	var callFunction = "add";
	var callArgs = JSON.stringify([{ name: name, phone: phone }]);
	nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
		listener: function (resp) {
			// 直接这里更新，不需要再次get
			num += 1
			$joinBox.show()
			$prizeBox.hide()
			nameArr.push(name)
			phoneArr.push(phone)
			$('#joinList').prepend("<p>" + name + "-" + phone + "</p>");
		}
	});
})

$getPerson.click(function () {
	start()
})

$reset.click(function () {
	var to = dappAddress;
	var value = "0";
	var callFunction = "restart"
	var callArgs = JSON.stringify(["reset"]);
	nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
		listener: function (resp) {
			var doc = JSON.parse(resp.result);
			if (doc === 1) {
				nameArr = []
				phoneArr = []
				num = 0
				$('#joinList').html("")
				$('#prizeList').html("")
			}
		}
	})
})
function fixList() {
	var to = dappAddress;
	var value = "0";
	var callFunction = "get"
	var callArgs;
	nebPay.simulateCall(to, value, callFunction, callArgs, {
		listener: function (resp) {
			if (resp.result == "") {
				return
			}
			var doc = JSON.parse(resp.result);
			nameArr = doc.name
			phoneArr = doc.phone
			num = nameArr.length
			$('#joinList').html("")
			for (var i = 0; i < num; i++) {
				$('#joinList').prepend("<p>" + nameArr[i] + "-" + phoneArr[i] + "</p>");
			}
		}
	})

}

//开始停止
function start() {
	if (runing) {
		runing = false;
		$prizeBox.show()
		$joinBox.hide()
		$reset.hide()
		$addPerson.hide()
		$btnTxt.removeClass('start').addClass('stop');
		// 设置添加按钮不可用
		$btnTxt.html('停止');
		startNum();
	} else {
		runing = true;
		var to = dappAddress;
		var value = "0";
		var callFunction1 = "get"
		var callArgs1
		var callFunction2 = "start";
		var callArgs2;
		var self = {}
		// 因为单个方法不支持又修改又返回数值，所以两个分开做
		nebPay.simulateCall(to, value, callFunction1, callArgs1, {
			listener: function (resp) {
				if (resp.result == "") {
					return
				}
				var doc = JSON.parse(resp.result);
				var name = doc.prize
				var phone = doc.phoneNum
				var randomNum = doc.randomNumber
				$joinBox.hide()
				$prizeBox.show()
				$reset.show()
				$addPerson.show()
				$('#prizeList').prepend("<p>" + ' ' + name + "-" + phone + "</p>");
				$btnTxt.removeClass('stop').addClass('start');
				// 设置添加按钮可用
				$btnTxt.html('抽奖');
				stop(name, phone);
				callArgs2 = JSON.stringify([randomNum])
				// 删除一下中奖的数组元素
				nebPay.call(to, value, callFunction2, callArgs2, {
					listener: function (resp) {
						for(var k = 0; k < nameArr.length; k++) {
							if (nameArr[k] == name) {
								nameArr.splice(k, 1)
								phoneArr.splice(k, 1)
							}
						}
					}
				});
			}
		})
		
	}

}
//循环参加名单
function startNum() {
	var showNum = Math.floor(Math.random() * num);
	$name.val(nameArr[showNum]);
	$phone.val(phoneArr[showNum]);
	t = setTimeout(startNum, 0);
}
//停止跳动
function stop(name, phone) {
	clearInterval(t);
	$name.val(name);
	$phone.val(phone);
	t = 0;
}
