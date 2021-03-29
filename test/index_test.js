const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { part: 'statistics', tag: '4i75Dqbhjvw' } } },
      { name: 'statistics/tag', testData: { id: jobID, data: { part: 'statistics', tag: '4i75Dqbhjvw' } } },
      { name: 'statistics/id', testData: { id: jobID, data: { part: 'statistics', id: '4i75Dqbhjvw' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(parseInt(data.data.items[0].statistics.viewCount), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'part not supplied', testData: { id: jobID, data: { tag: '4i75Dqbhjvw' } } },
      { name: 'tag not supplied', testData: { id: jobID, data: { part: 'statistics' } } },
      { name: 'unknown part', testData: { id: jobID, data: { part: 'not_real', tag: '4i75Dqbhjvw' } } },
      { name: 'unknown tag', testData: { id: jobID, data: { part: 'statistics', tag: 'not_real' } } }
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
