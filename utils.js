const fs = require('fs')
const Database = require('better-sqlite3')


exports.readFileToJson = path => {
  let data = fs.readFileSync(path, 'utf-8')
  return JSON.parse(data)
}

/**
 * 写入文件
 * @param content
 * @param path
 */
exports.saveToFile = (content, path) => {
  return fs.writeFileSync(path, content, 'utf-8')
}

/**
 * 追加内容
 * @param content
 * @param path
 */
exports.addToFile = (content, path) => {
  return fs.appendFileSync(path, content, 'utf-8')
}

/**
 * mondayfirst/XXQG_TiKu格式题库转对象
 * @param question
 * @param answer
 * @returns {{options: *[], answers: *[], title: *}}
 */
exports.mfToObj = (question, answer) => {
  const a = []
  const q = question.split('|')
  const options = []
  let key = ['title', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
  for (let i = 1; i < q.length; i++) {
    const option = {
      value: key[i],
      text: q[i]
    }
    options.push(option)
    if (q[i] === answer) {
      a.push(option)
    }
  }
  return {
    title: q[0],
    options,
    answers: a
  }
}

/**
 * 题库对象转Twelve-blog/Study_hamibot Json格式题库
 */
exports.objToTwJson = obj => {
  let q = ''
  for (let i = 0; i < obj.answers.length; i++) {
    q += `${obj.answers[i].value}`
  }
  q += ` ${obj.title}`
  for (let j = 0; j < obj.options.length; j++) {
    const option = obj.options[j]
    q += ' ' + option.text
  }
  return q
}

/**
 * 题库对象转Twelve-blog/Study_hamibot SQL格式题库
 */
exports.objToTwSQL = obj => {
  let sql = ''
  sql += `INSERT INTO 'tiku' VALUES ('${obj.title}`
  for (let i = 0; i < obj.options.length; i++) {
    sql += `|${obj.options[i].text}`
  }
  sql += `','${obj.answers[0].text}', NULL, '${obj.answers[0].value}', '${time()}');`
  return sql
}

/**
 * 格式化输出时间YYYY mm-DD hh:mm:ss
 * @param d
 * @param dash
 * @param colon
 * @returns {string}
 */
function time(d=new Date(), dash='-',colon=':') {
  function pad(n) {
    return n < 10 ? '0' + n : n
  }
  return d.getFullYear() + dash +
    pad(d.getMonth() + 1) + dash +
    pad(d.getDate()) + ' ' +
    pad(d.getHours()) + colon +
    pad(d.getMinutes()) + colon +
    pad(d.getSeconds())
}

exports.initDb = async path => {
  if (fs.existsSync(path)) {
    console.info(`Delete old ${path} file.`)
    fs.unlinkSync(path)
  }
  const db = new Database(path)
  await db.exec(`CREATE TABLE 'tiku' ('question' CHAR(231), 'answer' CHAR(29), 'wrongAnswer' CHAR(23), 'option' CHAR(10), 'datetime' int)`)
  return db
}