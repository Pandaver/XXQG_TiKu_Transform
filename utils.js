const fs = require('fs')

/**
 * mondayfirst/XXQG_TiKu格式题库转对象
 * @param {string} mf_json_string
 * @return {array}
 * Return Example
 * [{
 *   title: '根据《中华人民共和国土壤污染防治法》，未达到土壤污染风险评估报告确定的风险管控、修复目标的建设用地地块，禁止开工建设任何与        无关的项目。',
 *   options: [
 *     { value: 'A', text: '后期管理' },
 *     { value: 'B', text: '效果评估' },
 *     { value: 'C', text: '调查评估' },
 *     { value: 'D', text: '风险管控、修复' }
 *   ],
 *   answer: [ { value: 'D', text: '风险管控、修复' } ]
 * }]
 */
exports.mfToObj = mf_json_string => {
  const mf_obj = JSON.parse(mf_json_string)
  const questions = []
  for (let q in mf_obj) {
    let a = mf_obj[q]
    const answer = []
    q = q.split('|')
    const options = []
    let key = ['title', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
    for (let i = 1; i < q.length; i++) {
      const option = {
        value: key[i],
        text: q[i]
      }
      options.push(option)
      if (q[i] === a) {
        answer.push(option)
      }
    }
    questions.push({
      title: q[0],
      options,
      answer
    })
  }
  return questions
}

/**
 * 题库对象转Twelve-blog/Study_hamibot格式题库
 * @param obj
 * @return {string}
 */
exports.objToTw = obj => {
  let questions = ''
  for (let i = 0; i < obj.length; i++) {
    const q = obj[i]
    questions += `${q.answer[0].value} ${q.title}`
    for (let j = 0; j < q.options.length; j++) {
      const option = q.options[j]
      questions += ' ' + option.text
    }
    questions += '\n'
  }
  questions = questions.substring(0, questions.length - 1)
  return questions
}

/**
 * 保存文件
 * @param content
 * @param path
 */
exports.toFile = (content, path) => {
  fs.writeFile(path, content, 'utf-8', err => {
    if (err) {
      console.log('Write File Failed!')
      throw err
    }
  })
}


