import './App.css'
import { Editor } from './editor'
import { Game } from './game'
import buildings from './game/scenes/buildings.json'

function App () {
  return (
    <div className='App'>
      <Game data={buildings}/>
    </div>
  )
}

export default App
