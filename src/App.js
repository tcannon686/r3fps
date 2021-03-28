import './App.css'
import {
  useState
} from 'react'
import { Editor } from './editor'

function App () {
  const [data, setData] = useState(() => ({
    objects: []
  }))
  return (
    <div className='App'>
      <Editor data={data} onChange={setData} />
    </div>
  )
}

export default App
