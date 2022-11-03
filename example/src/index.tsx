import React from 'react'
import eruda from 'eruda'
import ReactDOM from 'react-dom'

import { App } from './App'

const el = document.createElement('div')
document.body.appendChild(el)

eruda.init({
    container: el,
    tool: [ 'console', 'elements' ]
})

ReactDOM.render(
    <React.StrictMode>
            <App />
        </React.StrictMode>,
    document.querySelector('#root')
)
