export const vipOptions = [{
		value: 0,
		label: '普通用户'
	},
	{
		value: 1,
		label: '会员'
	}
]

export const quotaOptions = [{
		lebel: '9元',
		value: '100额度'
	},
	{
		lebel: '29元',
		value: '400额度'
	},
	{
		lebel: '99元',
		value: '1600额度'
	},
]

export function getVipById(vip) {
	return vipOptions.find(item => item.value === vip)
}