export function timeDiff(time) {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff - hours * 3600000) / 60000);
  const seconds = Math.floor((diff - hours * 3600000 - minutes * 60000) / 1000);
  
  return `${hours}小时${minutes}分${seconds}秒`; 
}