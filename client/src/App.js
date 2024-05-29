import React from 'react'
import Header from './components/headers/Header'
import PagesAll from './components/mainpages/PagesAll'
import { BrowserRouter as Router} from 'react-router-dom'


const App = () => {
  return (
     <Router>
           <div className='App'>
              <Header/>
              <PagesAll/>
           </div>
     </Router>
  )
}

export default App
