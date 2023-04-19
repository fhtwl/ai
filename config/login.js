export const login = (e, success = () => {}) => {
  if(e != 401  && uni.getStorageSync("token")){
    return true;
  }
  let config = uni.getStorageSync("config");
	
	return uni.navigateTo({
	  url: "/pages/login/index?type=miniprogram",
		success: (data) => {
			success(data)
		}
	});
 
};
