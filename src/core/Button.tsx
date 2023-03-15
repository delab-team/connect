import * as React from 'react'
import './static/modal.css'
import './static/style.css'

import { DeLabButtonConfig } from './types/react'

import whiteLogo from './static/img/white.png'
import blackLogo from './static/img/black.png'

export const DeLabButton = React.memo(
    (props: DeLabButtonConfig) => (
        <div onClick={() => props.DeLabConnectObject.openModal()} className="delab-button">
            <img src={props.scheme === 'light' ? whiteLogo : blackLogo} className="delab-logo" />
            <span>DeLab Connect</span>
        </div>
    )
)

// export { DeLabButton }
