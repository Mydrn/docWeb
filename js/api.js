
(function($, api) {
	
		var serviceinfo = {
		app_ip: "https://www.mydrn.cn",
		app_port: "",
		path: "/doc/" //环境路径 
	};
	var localhost = serviceinfo.app_ip + serviceinfo.app_port + serviceinfo.path;
	var path = {
		login: localhost + "user/login", //登陆
		signUp: localhost + "user/signUp", //注册
		getUser: localhost + "user/token", //获取信息
		
	}
		//服务器地址存储本地
	localStorage.setItem('$serviceinfo', JSON.stringify(serviceinfo));
	
	
	/**
	 * post请求
	 * @param {Object} parameter 参数
	 * @param {Object} callback 解码后并转json的数据
	 */
	api.queryToPost = function(Interface, data, callback) {
		callback = callback || mui.noop;
		mui.ajax(path[Interface], {
			data: data,
			header: {
				'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
			},
			cache: false,
			type: 'POST', //HTTP请求类型
			timeout: 6000, //超时时间设置为6秒；
			success: function(data) {
				return callback(JSON.parse(base.decode(data)));
			},
			error: function(xhr, type, errorThrown) {
				if(type === 'error'){return callback({msg:'系统错误'})}
				if(type === 'abort'){return callback({msg:'暂无网络'})}
				if(type === 'timeout'){return callback({msg:'连接超时'})}
			}
		});
	};

	/**
	 * get请求
	 *  @param {Object} parameter 参数
	 * @param {Object} callback 解码后并转json的数据
	 */
	api.queryToGet = function(Interface, data, callback) {
		callback = callback || mui.noop;
		mui.ajax(path[Interface], {
			data: data,
			cache: false,
			type: 'GET', //HTTP请求类型
			timeout: 6000, //超时时间设置为6秒；
			success: function(data) {
				return callback(JSON.parse(base.decode(data)));
			},
			error: function(xhr, type, errorThrown) {
				if(type === 'error'){return callback({msg:'系统错误'})}
				if(type === 'abort'){return callback({msg:'暂无网络'})}
				if(type === 'timeout'){return callback({msg:'连接超时'})}
			}
		});
	};

	/**
	 * formData请求
	 * @param {Object} parameter 参数
	 * @param {Object} callback 解码后并转json的数据
	 */
	api.formDataToPost = function(Interface, formdata, callback) {
		callback = callback || mui.noop;
		mui.ajax(path[Interface], {
			cache: false,
			contentType: false, //必须 
			processData: false, //必须
			async: true,
			data: formdata,
			type: 'POST', //HTTP请求类型
//			timeout: 10000, //超时时间设置为6秒；
			success: function(data) {
				return callback(JSON.parse(base.decode(data)));
			},
			error: function(xhr, type, errorThrown) {
				if(type === 'error'){return callback({msg:'系统错误'})}
				if(type === 'abort'){return callback({msg:'暂无网络'})}
				if(type === 'timeout'){return callback({msg:'连接超时'})}
			}
		});
	};
	
	
	/**
	 * 用户登录
	 **/
	api.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		api.queryToPost('login', {phone: loginInfo.account, pwd:loginInfo.password},function(data){
			console.log(data.accessToken);
			if (data.accessToken.status == 1) {
				return api.createState(loginInfo.account, callback);
			} else {
				return callback(data.accessToken.msg);
			}
		})
		
	};

	api.createState = function(uid, callback) {
		var state = api.getState();
		//state.uid = uid;
		state.token = "token123456789";
		api.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	api.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	api.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	api.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = api.getSettings();
		//settings.gestures = '';
		//api.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	api.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

}(mui, window.api = {}));