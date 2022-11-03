import { DeLabConnect } from '../Connect'

type DeLabScheme = 'dark' | 'light'

interface DeLabModalConfig {
    DeLabConnectObject: DeLabConnect,
    scheme: DeLabScheme
}

interface DeLabButtonConfig {
    DeLabConnectObject: DeLabConnect,
    scheme: DeLabScheme
}

export type { DeLabModalConfig, DeLabButtonConfig, DeLabScheme }
