function getRandomInt(min, max) { // 返回 min-max之间的随机数
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) { // 洗牌函数: 打乱数组
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(0, i)
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
  return arr
}

export function debounce(func, delay) { // 函数柯里化: 返回新函数并延迟执行
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

