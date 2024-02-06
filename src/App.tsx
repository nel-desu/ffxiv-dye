import { useState } from 'react'
import colorData from './assets/colors.json'
import './App.css'

type Color = {
  color: string
  name: string
  type: string
}

const TURN = 5

function App() {

  // 所有染剂
  const [colors] = useState(colorData as Array<Color>)
  // 是否已进行一轮
  const [played, setPlayed] = useState(false)

  // 得分
  const [score, setScore] = useState(0)
  // 当前剩余轮数
  const [turn, setTurn] = useState(TURN)
  // 是否开始
  const [start, setStart] = useState(false)

  // 答案
  const [answer, setAnswer] = useState(colors[0])
  // 选项
  const [selection, setSelection] = useState<Color[]>([])

  function gameStart() {
    setScore(0)
    setStart(true)
    changeColor()
  }

  function changeColor() {
    setTurn(turn - 1)

    const sel = colors[random(0, colors.length)]
    setAnswer(sel)
    console.log(sel.name)
    const sameType = colors.filter((v) => v.type === sel.type && v.color !== sel.color)
    shuffleArray(sameType)

    const items = new Array<Color>
    for (let i = 0; i < 3; i++) {
      const item = sameType.pop()
      if (item) {
        items.push(item)
      }
    }
    items.push(sel)
    shuffleArray(items)
    setSelection(items)
  }

  function onSelectColor(color: Color) {
    if (color.name === answer.name) {
      setScore(score + 1)
    }

    if (turn > 0) {
      changeColor()
    } else {
      gameover()
    }
  }

  function gameover() {
    setTurn(TURN)
    setPlayed(true)
    setStart(false)
  }

  function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1))
  }

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
        {played ? <h4>总计得分：{score}</h4> : <></>}
        <div className="card">
          <button onClick={() => gameStart()}>
            {played ? '重新开始' : '开始'}
          </button>
        </div>
        <p className="read-the-docs">
          染剂色值来自
          <a href="https://ff14.huijiwiki.com/wiki/%E6%9F%93%E5%89%82" target="_blank" rel="noopener noreferrer">
            最终幻想 XIV 中文维基
          </a>
        </p>
      </div>

      <div style={start ? { display: 'block' } : { display: 'none' }}>
        <h2>这是什么染剂</h2>
        <h3>剩余次数：{turn} / 得分：{score}</h3>
        <div className='color-container'>
          <div className='color-box' style={{ background: (answer.color) }}></div>
        </div>
        <p style={{color: (answer.color)}}>{answer.color}</p>

        <div className="card">
          {selection.map((v) => (
            <button onClick={() => onSelectColor(v)}>
              {v.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
