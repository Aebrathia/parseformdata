const { parseFormData } = require('./index.js')
const { chrome, firefox } = require('./fixtures')

describe('parseFormData', () => {
  it.each([
    ['chrome', chrome],
    ['firefox', firefox],
  ])('supports %s', () => {
    expect(parseFormData(chrome)).toEqual({
      file: {
        body: expect.any(String),
        headers: {
          'Content-Disposition': {
            filename: "example.jpg",
            name: 'file'
          },
          'Content-Type': 'image/jpeg',
        }
      },
      field: {
        body: "My field value",
        headers: {
          'Content-Disposition': {
            name: 'field'
          }
        }
      }
    })
  })
})
