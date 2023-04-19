const sensitiveWords = ["你是谁", "openai", 'chatgpt']
export function filterWords (text) {
	const item = sensitiveWords.find(item => text.toLocaleLowerCase().indexOf(item) > -1)
	if(item) {
		return {
			type: 'sensitive',
			msg: '提问包含敏感词汇，请修改您的提问'
		}
	}
		
	else {
		return text
	}
}