import './App.css'
import {
  useState
} from 'react'
import { Editor } from './editor'
import { scene } from './game'

function App () {
  const [data, setData] = useState(() => scene({}))
  return (
    <div className='App'>
      <Editor data={data} onChange={setData} />
    </div>
  )
}

export default App
