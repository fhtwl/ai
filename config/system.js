export function getSystemInfo() {
	// return new Promise((resolve, reject) =>{
		
	// })
	uni.getSystemInfo({
		success: function(res) {
			console.log(res)
		}
	});
	const accountInfo = wx.getAccountInfoSync();
	const version = accountInfo.miniProgram.version // 小程
	return {
		version
	}
}