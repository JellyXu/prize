var runing = true;
var num = 0;
var t;

var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
var nebPay = new NebPay();
var dappAddress = 'n1Pm2EVNCaafggZxTY6FioW9qYawcs216pE'; //改成我的地址
var nameArr = []
var phoneArr = []
init()
$("#prizeBox").hide()
function init() {
	if (typeof (webExtensionWallet) !== "undefined") {
		$("#noExtension").hide()
	}
	fixList();
	timer = setInterval(function () {
		fixList();
	}, 1500);
}

$("#addPerson").click(function () {
	var name = $('.name').text()
	var phone = $('.phone').text()
	// 判断是否有重复的
	if($.inArray(name, nameArr) || $.inArray(phone, phoneArr)) {
		return
	}
	var to = dappAddress;
	var value = "0";
	var callFunction = "add";
	var callArgs = JSON.stringify([name, phone]);
	nebPay.call(to, value, callFunction, callArgs, { //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
		listener: function (resp) {
			// 直接这里更新，不需要再次get
			num += 1
			nameArr.push(name)
			phoneArr.push(phone)
		}
	});
	$('#joinList').prepend("<p>" + td + ' ' + name + "-" + phone + "</p>");
})

$("#getPerson").click(function () {
	start()
})

function getStatus() {
	var to = dappAddress;
	var value = "0";
	var callFunction = "get"
	var callArgs;
	var self = {}
	nebPay.simulateCall(to, value, callFunction, callArgs, { //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
		listener: function (resp) {
			var doc = JSON.parse(resp.result);
			self.name = doc.name;
			self.phone = doc.phone;
		}
	})
	return self
}

function getStart() {
	var to = dappAddress;
	var value = "0";
	var callFunction = "start";
	var callArgs;
	var self = {}
	nebPay.simulateCall(to, value, callFunction, callArgs, { //使用nebpay的simulateCall接口去执行get查询, 模拟执行.不发送交易,不上链
		listener: function (resp) {
			var doc = JSON.parse(resp.result);
			self.name = doc.name;
			self.phone = doc.phone;
		}
	});
	return self
}

function fixList() {
	var result = getStatus()
	var joinList = $("#joinList")
	nameArr = result.name
	phoneArr = result.phone
	num = nameArr.length
	joinList.html("")
	for (var i = 0; i < num; i++) {
		$('#joinList .list').prepend("<p>" + td + ' ' + names[i] + "-" + phones[i] + "</p>");
	}
}

//开始停止
function start() {
	if (runing) {
		runing = false;
		$("#prizeBox").show()
		$("#joinBox").hide()
		$('#btntxt').removeClass('start').addClass('stop');
		// 设置添加按钮不可用
		$('#btntxt').html('停止');
		startNum();
	} else {
		runing = true;
		var result = getStart()
		var name = result.name
		var phone = result.phone
		$("#prizeBox").hide()
		$("#joinBox").show()
		$('.name').text(name)
		$('.phone').text(phone)
		$('#prizeList').prepend("<p>" + td + ' ' + name + "-" + phone + "</p>");
		$('#btntxt').removeClass('stop').addClass('start');
		// 设置添加按钮可用
		$('#btntxt').html('抽奖');
		stop();
	}

}
//循环参加名单
function startNum() {
	var showNum = Math.floor(Math.random() * num);
	$('.name')(nameArr[showNum]);
	$('.phone')(phoneArr[showNum]);
	t = setTimeout(startNum, 0);
}
//停止跳动
function stop() {
	clearInterval(t);
	t = 0;
}
