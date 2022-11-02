import { DeLabConnect } from "index";

type DeLabEvent = {
    data?: any;
} & Event

type DeLabNetwork = 'mainnet' | 'testnet'
type DeLabScheme = 'dark' | 'light'
type DeLabTypeConnect = 'tonhub' | 'toncoinwallet' | 'tonkeeper' | undefined
type DeLabAddress = string | undefined

interface DeLabError {
    error: string,
    data?: any
}

interface DeLabConnecting {
    address: DeLabAddress,
    network: DeLabNetwork,
    typeConnect: DeLabTypeConnect,
    autosave: boolean
}

interface DeLabTransaction {
    to: string, // Destination
    value: string, // Amount in nano-tons
    stateInit?: string, // Optional serialized to base64 string state_init cell
    text?: string, // Optional comment. If no payload specified -
    payload?: string // Optional serialized to base64 string payload cell
}
interface DeLabModalConfig {
    DeLabConnectObject: DeLabConnect,
    scheme: DeLabScheme
}

interface DeLabButtonConfig {
    DeLabConnectObject: DeLabConnect,
    scheme: DeLabScheme
}

export type {
    DeLabEvent,
    DeLabNetwork,
    DeLabScheme,
    DeLabTypeConnect,
    DeLabAddress,
    DeLabError,
    DeLabConnecting,
    DeLabTransaction,
    DeLabModalConfig,
    DeLabButtonConfig
}
