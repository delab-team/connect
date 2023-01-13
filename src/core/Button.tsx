import * as React from 'react'
import './static/modal.css'
import './static/style.css'

import { DeLabButtonConfig } from './types/react'

const white = 'https://ipfs.filebase.io/ipfs/bafkreigpmboyvo43fa4ybalflby3pb3eg2emgzn7axkgd7rmvrgdpx4oja'
const black = 'https://ipfs.filebase.io/ipfs/bafkreibbn3nq6avodph3lcg6qlak6tbjha7levxzwgyk7nyrwot3ajvuwq'

export const DeLabButton = React.memo(
    (props: DeLabButtonConfig) => (
        <div onClick={() => props.DeLabConnectObject.openModal()} className="delab-button">
            <img src={props.scheme === 'light' ? white : black} className="delab-logo" />
            <span>DeLab Connect</span>
        </div>
    )
)

// export { DeLabButton }
