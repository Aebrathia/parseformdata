const removeEmpty = (part) => !!part && !/^\r?\n$/.test(part)
const cleanNewLines = (part) => part.replace(/^\r?\n|\r?\n$/g, '')
const splitHeaderAndBody = (part) => {
  const [, header, body] = part.match(/^(.+?)\r?\n\r?\n(.+)$/s)
  return [header, body]
}
const parseContentDisposition = (value) => {
  const [, ...entries] = value.split(/;\s*/)
  return Object.fromEntries(entries.map(e => {
    const [key, val] = e.split('=')
    return [key, val.replace(/"/g, '')]
  }))
}
const parseHeaders = (part) => {
  const [rawHeaders, body] = part
  const headers = Object.fromEntries(rawHeaders.split(/\n/).map(h => h.split(/:\s*/)))
  headers['Content-Disposition'] = parseContentDisposition(headers['Content-Disposition'])
  return [headers, body]
}
const toKeyValue = (acc, [headers, body]) => {
  acc[headers['Content-Disposition'].name] = { headers, body }
  return acc
}

/**
 * Useful to debug `parseFormData`
 * Usage `.map(log)` `.map(debug)`
 * Using `debugger;` in above functions is also useful
 */
// const log = (e) => console.log({ e }) || e
// const debug = (e) => { debugger; return e }

/**
 * MSW doesn't support multipart/form-data yet
 * I made a custom naive parser to circumvent this
 */
const parseFormData = (body) => {
  return body
    .split(/----[\w-]+/)
    .filter(removeEmpty)
    .map(cleanNewLines)
    .map(splitHeaderAndBody)
    .map(parseHeaders)
    .reduce(toKeyValue, {})
}

module.exports = {
  parseFormData,
}
