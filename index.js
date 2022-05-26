const https = require('https')
const utils = require('./utils')
const config = require('./config')

https.get( `${config.githubRawProxy}mondayfirst/XXQG_TiKu/main/题库_排序版.json`, async res => {
  res.setEncoding('utf-8')
  let mf_tiku = ''
  res.on('data', append => {
    console.info('mondayfirst/XXQG_TiKu Downloading...')
    mf_tiku += append
  }).on('end', () => {
    console.info('mondayfirst/XXQG_TiKu Download Complete.')
    // console.info('mondayfirst/XXQG_TiKu Save To File...')
    // utils.toFile(mf_tiku, './XXQG_TiKu.json')
    // console.info('Complete.')
    console.info('mondayfirst/XXQG_TiKu Transform To TiKu Object...')
    const obj = utils.mfToObj(mf_tiku)
    console.info('Complete.')
    console.info('TiKu Object Transform To Twelve-blog/Study_hamibot...')
    const tw_tiku = utils.objToTw(obj)
    console.info('Complete.')
    console.info('mondayfirst/XXQG_TiKu Save To File...')
    utils.toFile(tw_tiku, './question')
    console.info('Complete.')
  })
})
