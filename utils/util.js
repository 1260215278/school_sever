const utils = {
	// 防抖
	debounce: function debounce(fn, delay) {
		var timer = null
		return function() {
			var args = arguments
			var that = this
			// 清除上一次延时器
			clearTimeout(timer)
			timer = setTimeout(function() {
				fn.apply(that, args)
			}, delay)
		}
	},
	// 富文本图片自适应
	richPicAdaptive: function richPicAdaptive(data) {
		const regex = new RegExp('<img', 'gi')
		data = data.replace(regex, `<img style="max-width: 100%; width:100%; height: auto; vertical-align: middle;"`)
		return data
	},
	// 订单状态文字显示
	statusText: function statusText(status) {
		switch (status) {
			case 1:
				return '待付款'
			case 2:
				return '待发货'
			case 3:
				return '待收货'
			case 4:
				return '待评价'
			case 5:
				return '已完成'
			case 6:
				return '取消订单'
			case 7:
				return '申请退款'
			default:
				return ''
		}
	}
}

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

module.exports = {
	debounce: utils.debounce,
	richPicAdaptive: utils.richPicAdaptive,
	statusText: utils.statusText,
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils
}
