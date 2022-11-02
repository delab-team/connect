import * as React from 'react'
import { Button } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import './static/modal.css'
import './static/style.css'

import { DeLabButtonConfig } from './types/index'

const white = 'https://ipfs.io/ipfs/bafkreigpmboyvo43fa4ybalflby3pb3eg2emgzn7axkgd7rmvrgdpx4oja'
const black = 'https://ipfs.io/ipfs/bafkreibbn3nq6avodph3lcg6qlak6tbjha7levxzwgyk7nyrwot3ajvuwq'

export const DeLabButton = React.memo(
    (props: DeLabButtonConfig) => (
        <Button onClick={() => props.DeLabConnectObject.openModal()} size="l" className="delab-button" before={
            <img src={props.scheme === 'light' ? white : black} className="delab-logo" />
        }>
            DeLab Connect
        </Button>
    )
)

// export { DeLabButton }
