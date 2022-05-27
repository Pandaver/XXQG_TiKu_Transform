const https = require('https')
const utils = require('./utils')
const config = require('./config')


https.get( `${config.githubRawProxy}mondayfirst/XXQG_TiKu/main/题库_排序版.json`, async res => {
  res.setEncoding('utf-8')
  utils.saveToFile('', './XXQG_TiKu.json')
  console.info('mondayfirst/XXQG_TiKu Downloading...')
  res.on('data', append => {
    utils.addToFile(append, './XXQG_TiKu.json')
  }).on('end', () => {
    console.info('Complete.')
    console.info('Reading XXQG_TiKu.json...')
    const mf_tiku = utils.readFileToJson('./XXQG_TiKu.json')
    console.info('Complete.')
    console.info('Transform...')
    transform(mf_tiku)
  })
})

async function transform(mf_obj) {
  utils.saveToFile('', './question')
  // utils.saveToFile('', './QuestionBank.sql')
  const db = await utils.initDb('./QuestionBank.db')
  let i = 0
  for (let q in mf_obj) {
    const obj = utils.mfToObj(q, mf_obj[q])
    const tw_json = utils.objToTwJson(obj)
    const tw_sql = utils.objToTwSQL(obj)
    await db.prepare(tw_sql).run()
    i++
    utils.addToFile(tw_json + '\n', './question')
    // utils.addToFile(tw_sql + '\n', './QuestionBank.sql')
  }
  db.close()
  console.info(`Processed ${i} data.`)
  console.info('Complete.')
}
