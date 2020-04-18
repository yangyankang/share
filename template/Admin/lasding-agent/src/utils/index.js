function addZero (n) {
  return n >= 10 ? n + '' : '0' + n
}
/**
 *
 * @export
 * @param {Date|String|timestamp} date
 */
export function parseTime (
  date = new Date(),
  type = 'yyyy-MM-dd HH:mm:ss'
) {
  let nDate
  if (typeof date === 'object') {
    nDate = date
  } else {
    if (/^\d{13,}$/.test(date)) {
      nDate = new Date(parseInt(date))
    } else {
      nDate = new Date(date)
    }
  }
  if (type === 'date') {
    return nDate
  }
  let iY = nDate.getFullYear() + ''
  let iM = nDate.getMonth() + 1 + ''
  let iD = nDate.getDate() + ''
  let iH = nDate.getHours() + ''
  let im = nDate.getMinutes() + ''
  let iS = nDate.getSeconds() + ''
  let dateItem = {
    'yyyy': iY,
    'yy': iY.substring(1),
    'MM': addZero(iM),
    'M': iM,
    'dd': addZero(iD),
    'd': iD,
    'HH': addZero(iH),
    'H': iH,
    'mm': addZero(im),
    'm': im,
    'ss': addZero(iS),
    's': iS
  }
  if (type === 'timestamp') {
    return nDate.getTime()
  } else {
    let [typeD, typeT] = type.split(' ')
    let returnVal = ''
    if (typeD) {
      let tmpArr = typeD.split('-')
      returnVal += tmpArr.map(x => dateItem[x]).join('-')
    }
    if (typeT) {
      let t = typeT.split(':')
      returnVal += ' ' + t.map(x => dateItem[x]).join(':')
    }
    return returnVal
  }
}
