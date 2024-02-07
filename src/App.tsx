import { useState } from 'react'
import colorData from './assets/colors.json'
import './App.css'
import { Color } from './Color'
import { Answers } from './Answers'
import { Modal } from 'antd'

// 总次数
const TURN = 20
// 保存全部答案
const allAnswers = new Answers()

function App() {
  // 所有染剂数据
  const [colors] = useState(colorData as Array<Color>)

  // 得分
  const [score, setScore] = useState(0)
  // 当前剩余次数
  const [turn, setTurn] = useState(0)
  // 完成一次标记
  const [played, setPlayed] = useState(false)
  // 开始游戏标记
  const [start, setStart] = useState(false)

  // 当前答案
  const [answer, setAnswer] = useState<Color>(colors[0])
  // 当前选项
  const [selections, setSelections] = useState<Color[]>([])

  // 弹窗控制
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalColor, setModalColor] = useState(colors[0])

  /**
   * 游戏开始
   */
  function gameStart() {
    setScore(0)
    setStart(true)

    // 生成一批颜色，数量为 TURN
    const copyColors = [...colors]
    shuffleArray(copyColors)
    allAnswers.put(copyColors.slice(0, TURN))
    changeColor()
  }

  /**
   * 点击选项后更换当前颜色
   */
  function changeColor() {
    setTurn(turn + 1)

    // 获取当前答案
    const sel = allAnswers.next()
    setAnswer(sel)
    console.log(sel.name)

    // 找到类似的颜色并打乱
    const sameType = colors.filter((v) => v.type === sel.type && v.color !== sel.color)
    shuffleArray(sameType)

    // 得到四个选项
    const fourSel = new Array<Color>
    for (let i = 0; i < 3; i++) {
      const item = sameType.pop()
      if (item) {
        fourSel.push(item)
      }
    }
    fourSel.push(sel)

    // 再打乱选项
    shuffleArray(fourSel)
    setSelections(fourSel)
  }

  /**
   * 点击选项
   * @param color 当前选项对应的染剂 
   */
  function onSelect(color: Color) {
    if (color.name === answer.name) {
      setScore(score + 1)
    }

    if (turn < TURN) {
      changeColor()
    } else {
      gameover()
    }
  }

  /**
   * 游戏结束
   */
  function gameover() {
    setTurn(0)
    setPlayed(true)
    setStart(false)
  }

  /**
   * 弹窗显示颜色信息
   */
  function showModal(color: Color) {
    setModalColor(color)
    setIsModalOpen(true)
  }

  function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1))
  }

  /**
   * 打乱数组
   */
  function shuffleArray(array: Color[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function getArrayItems(arr: Array<Color>, num: number) {
    const tempArray = [...arr]
    const returnArray = []
    for (let i = 0; i < num; i++) {
      if (tempArray.length > 0) {
        const arrIndex = Math.floor(Math.random() * tempArray.length)
        returnArray[i] = tempArray[arrIndex]
        tempArray.splice(arrIndex, 1)
      } else {
        break
      }
    }
    return returnArray
  }

  return (
    <>
      <div style={start ? { display: 'none' } : { display: 'block' }}>
        <h1>这是什么染剂</h1>
        <h4>根据颜色选择染剂名称</h4>
        {played ?
          <div>
            <h4>总分：{score}</h4>
            <div className='color-cell-container'>
              {allAnswers.colors.map((v) => (
                <span onClick={() => showModal(v)} className='color-cell' style={{ background: (v.color) }} />
              ))}
            </div>
          </div> :
          <></>
        }
        <div className="card">
          <button onClick={() => gameStart()}>
            {played ? '重新开始' : '开始'}
          </button>
        </div>
        <p className="read-the-docs">
          染剂色值来自
          <a href="https://ff14.huijiwiki.com/wiki/%E6%9F%93%E5%89%82"  target="_blank" rel="noopener noreferrer">
            最终幻想 XIV 中文维基 - 染剂
          </a>
        </p>
      </div>

      <div style={start ? { display: 'block' } : { display: 'none' }}>
        <h2>这是什么染剂</h2>
        <h3>剩余次数：{TURN - turn} / 得分：{score}</h3>
        <div className='color-container'>
          <div className='color-box' style={{ background: (answer.color) }}></div>
        </div>
        <p style={{ color: (answer.color) }}>{answer.color}</p>

        <div className="card">
          {selections.map((v) => (
            <button onClick={() => onSelect(v)}>
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <Modal title={modalColor.name} open={isModalOpen} onCancel={() => setIsModalOpen(false)}
        footer={() => (<></>)}>
        <div style={{ textAlign: 'center' }}>
          <div className='color-container'>
            <div className='color-box' style={{ background: (modalColor.color) }}></div>
          </div>
          <p>{modalColor.name}</p>
          <p>{modalColor.color}</p>
        </div>
      </Modal>
    </>
  )
}

export default App
