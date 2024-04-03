import router from 'next/router'
export const isMobile = () => {
  return typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isIOS = () => {
  return (
    typeof window !== 'undefined' &&
    (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) || navigator.userAgent.includes('Mac'))
  )
}

export const isEmpty = (val: any) => {
  return ['', null, undefined].includes(val) || (Array.isArray(val) && val.length === 0)
}

export const isNumber = (number: any) => {
  return !isEmpty(number) && !isNaN(Number(number))
}

export const decodeHTML = (input: string) => {
  const e = document.createElement('textarea')
  e.innerHTML = input
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue || ''
}

export const formatFormData = (data: Object) => {
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) && value.some((v) => typeof window !== 'undefined' && v instanceof File)) {
      fd.append(`${key}[]`, value as any)
    } else {
      fd.append(key, typeof value === 'string' || (typeof window !== 'undefined' && value instanceof File) ? value : JSON.stringify(value))
    }
  })
  return fd
}

export const parseStyles = (stringStyles: string | React.CSSProperties) =>
  typeof stringStyles === 'string'
    ? stringStyles.split(';').reduce((acc, style) => {
        const colonPosition = style.indexOf(':')

        if (colonPosition === -1) {
          return acc
        }

        const camelCaseProperty = style
            .substr(0, colonPosition)
            .trim()
            .replace(/^-ms-/, 'ms-')
            .replace(/-./g, (c) => c.substr(1).toUpperCase()),
          value = style.substr(colonPosition + 1).trim()

        return value ? { ...acc, [camelCaseProperty]: value } : acc
      }, {})
    : {}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getDDMMYYYY = (inpDate: any) => {
  if (!inpDate) return ''
  if ((typeof inpDate === 'string' && inpDate == null) || inpDate.length == 0) return ''
  if (typeof inpDate === 'number') inpDate = inpDate * 1000
  let _date = new Date(inpDate)
  let _day = _date.getDate() < 10 ? `0${_date.getDate()}` : _date.getDate().toString()
  let _month = _date.getMonth() + 1 < 10 ? `0${_date.getMonth() + 1}` : (_date.getMonth() + 1).toString()
  return `${_day}.${_month}.${_date.getFullYear()}`
}

export const getYYYYMMDD = (inpDate: any) => {
  if (!inpDate) return ''
  if ((typeof inpDate === 'string' && inpDate == null) || inpDate.length == 0) return ''
  if (typeof inpDate === 'number') inpDate = inpDate * 1000

  let _date = new Date(inpDate)
  let _day = _date.getDate() < 10 ? `0${_date.getDate()}` : _date.getDate().toString()
  let _month = _date.getMonth() + 1 < 10 ? `0${_date.getMonth() + 1}` : (_date.getMonth() + 1).toString()

  return `${_date.getFullYear()}/${_month}/${_day}`
}

export const getHourMinute = (strDate: string) => {
  if (strDate == null || strDate.length == 0) return '0:00'
  let _date = new Date(strDate)
  return `${_date.getHours()}:${_date.getMinutes()}`
}

export const getNotifyTime = (_pushed: string) => {
  let pushed = new Date(_pushed)
  let today = new Date()
  if (today.getFullYear === pushed.getFullYear && today.getMonth() === pushed.getMonth()) {
    if (today.getDate() == pushed.getDate()) return 'Today'
    else {
      //yesterday
      if (new Date(today.setDate(today.getDate() - 1)).getDate() == pushed.getDate()) return 'Yesterday'
    }
  } else return getDDMMYYYY(_pushed)
}

export const gotoPage = (path: string, query?: any) => {
  router
    .push({
      pathname: path,
      search: query ? query : null,
    })
    .then(() => {
      router.reload()
    })
}

export const isExpired = (expired_date: Date) => {
  let now = new Date()
  if (now > expired_date) return true
  return false
}

export const randomId = () => {
  let x = new Date()
  return `${x.getTime()}.${(Math.random() + 1).toString(36).substring(2)}`
}

export const formatParagraph = (text: string, signal: string, link?: string) => {
  link = link ?? signal
  let result = text
    .split(signal)
    .map((txt) => `<p>${txt}</p>`)
    .join(`<a href="${link}">${signal}</a>`)
  return result
}

export const capitalizeFirstLetter = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

export const capitalizeFirstLetterAllWords = (input: string) => {
  let words = input.split(' ').map((word) => {
    return capitalizeFirstLetter(word)
  })
  return words.join(' ')
}

export const localStorageAvailable = () => {
  try {
    // Incognito mode might reject access to the localStorage for security reasons.
    // window isn't defined on Node.js
    // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
    const key = '__some_random_key_you_are_not_going_to_use__'
    window.localStorage.setItem(key, key)

    window.localStorage.removeItem(key)

    return true
  } catch (err) {
    return false
  }
}
