const storage = {
  1: 'localStorage',
  2: 'sessionStorage',
  'localStorage': 'localStorage',
  'sessionStorage': 'sessionStorage'
}

export function setItem (t, n, v) {
  let tmpData = {
    t: Date.now(),
    value: v
  }
  window[storage[t]].setItem(n, JSON.stringify(tmpData))
}

export function getItem (t, n) {
  let tmpData = window[storage[t]].getItem(n)
  return tmpData ? JSON.parse(tmpData).value : void 0
}

export function rmItem (t, n) {
  window[storage[t]].removeItem(n)
}
