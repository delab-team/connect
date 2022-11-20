import EventEmitter from 'events'
import {
    TonhubConnector,
    TonhubCreatedSession,
    TonhubSessionAwaited,
    TonhubTransactionRequest,
    TonhubTransactionResponse,
    TonhubWalletConfig
} from 'ton-x'

import {
    DeLabNetwork,
    DeLabTypeConnect,
    DeLabAddress,
    DeLabConnecting,
    DeLabTransaction
} from './types'

const axios = require('axios').default

declare global {
    interface Window { ton: any; }
}

function getRandomArbitrary (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

class DeLabConnect {
    private _hostName: string

    private _appUrl: string

    private _appName: string

    private _events = new EventEmitter()

    private _network: DeLabNetwork

    private _connectorTonHub: TonhubConnector

    private _sessionTonHub: TonhubCreatedSession | undefined

    private _walletTonHub: TonhubWalletConfig | undefined

    private _address: DeLabAddress

    private _balance: string | undefined

    private _typeConnect: DeLabTypeConnect

    private _isOpenModal: boolean = false

    constructor (appUrl: string, appName: string, network: DeLabNetwork = 'mainnet', hostNameTonkeeper: string = 'tonkeeper-conn.delab.team') {
        this._appUrl = appUrl
        this._appName = appName
        this._network = network

        this._hostName = hostNameTonkeeper

        this._connectorTonHub = new TonhubConnector({ network: network === 'mainnet' ? 'mainnet' : 'sandbox' })

        this.loadWallet()

        console.log('v: 1.2.3')
    }

    public loadWallet (): void {
        if (DeLabConnect.getStorageData('init')) {
            const typeConnect = DeLabConnect.getStorageData('type-connect')
            switch (typeConnect) {
                case 'tonhub':
                    this._sessionTonHub = DeLabConnect.getStorageData('session-tonhub')
                    this._address = DeLabConnect.getStorageData('address')
                    this._walletTonHub = DeLabConnect.getStorageData('wallet-tonhub')
                    this._network = DeLabConnect.getStorageData('network')
                    this._typeConnect = 'tonhub'

                    this.connectTonHub()
                    break

                case 'toncoinwallet':

                    this._address = DeLabConnect.getStorageData('address')
                    this._typeConnect = 'toncoinwallet'

                    this.connectToncoinWallet()
                    break

                case 'tonkeeper':
                    this._address = DeLabConnect.getStorageData('address')
                    this._typeConnect = 'tonkeeper'

                    this.sussesConnect()
                    break
                default:
                    break
            }
        }
    }

    private newEvent (name: string, data: any): void {
        this._events.emit(
            name,
            { data }
        )
    }

    private static addStorageData (key: string, value: any): void {
        localStorage.setItem('delab-' + key,  JSON.stringify(value))
    }

    private static getStorageData (key: string): any {
        try {
            return JSON.parse(localStorage.getItem('delab-' + key) ?? '')
        } catch (error) {
            return localStorage['delab-' + key]
        }
    }

    private static delStorageData (key: string): void {
        localStorage.removeItem('delab-' + key)
    }

    private clearStorage (): void {
        switch (this._typeConnect) {
            case 'tonhub':
                DeLabConnect.delStorageData('init')
                DeLabConnect.delStorageData('type-connect')
                DeLabConnect.delStorageData('address')
                DeLabConnect.delStorageData('wallet-tonhub')
                DeLabConnect.delStorageData('session-tonhub')
                DeLabConnect.delStorageData('network')
                break

            case 'toncoinwallet':
            case 'tonkeeper':
                DeLabConnect.delStorageData('init')
                DeLabConnect.delStorageData('type-connect')
                DeLabConnect.delStorageData('address')
                DeLabConnect.delStorageData('network')
                break

            default:
                break
        }
    }

    private async createTonHub (): Promise<void> {
        const sessionCreated: TonhubCreatedSession = await this._connectorTonHub.createNewSession({
            name: this._appName,
            url: this._appUrl
        })
        this._sessionTonHub = sessionCreated
        console.log(sessionCreated)
    }

    private async sendTransactionTonHub (transaction: DeLabTransaction): Promise<any> {
        if (this._sessionTonHub && this._walletTonHub) {
            const request: TonhubTransactionRequest = {
                seed: this._sessionTonHub.seed, // Session Seed
                appPublicKey: this._walletTonHub.appPublicKey, // Wallet's app public key
                to: transaction.to,
                value: transaction.value,
                timeout: 5 * 60 * 1000, // 5 minut timeout
                stateInit: transaction.stateInit,
                text: transaction.text,
                payload: transaction.payload
            }
            const response: TonhubTransactionResponse = await this
                ._connectorTonHub.requestTransaction(request)
            // console.log(response.type)
            if (response.type === 'rejected') {
                // Handle rejection
            } else if (response.type === 'expired') {
                // Handle expiration
                return false
            } else if (response.type === 'invalid_session') {
                // Handle expired or invalid session
            } else if (response.type === 'success') {
                // Handle successful transaction
                const externalMessage = response.response // Signed
                return { output: externalMessage }
            } else {
                throw new Error('Impossible')
            }
            this.newEvent('error-transaction', { error: response.type })
            return { error: 'transaction', data: response.type }
        }
        throw new Error('Error session or walletConfig tonhub')
    }

    private static async sendTransactionToncoinWallet
    (transaction: DeLabTransaction): Promise<boolean> {
        const sendData = {
            value: Number(transaction.value),
            to: transaction.to,
            dataType: 'boc',
            data: transaction.payload,
            stateInit: transaction.stateInit
        }
        const singTon = await window.ton.send('ton_sendTransaction', [ sendData ])
        return singTon
    }

    private async getHashServer (id: string) {
        const hashData = await axios.get(`https://${this._hostName}/getAddress/${id}`)
        if (hashData.data !== '') {
            console.log('server -> ', hashData.data)
            return hashData.data
        }
        return null
    }

    private async interval (id: string): Promise<undefined | any> {
        let returnData = null
        let count = 0
        while (true) {
            /* eslint-disable no-await-in-loop */
            count += 1
            if (count === 100) {
                return undefined
            }
            const obDat = await this.getHashServer(id)
            if (obDat) {
                returnData = obDat
                return returnData
            }
            await sleep(2000)
            /* eslint-enable no-await-in-loop */
        }
    }

    private sussesConnect () {
        const sendData: DeLabConnecting = {
            address: this._address,
            network: this._network,
            typeConnect: this._typeConnect,
            autosave: true
        }
        this.newEvent('connect', sendData)
    }

    private sendTransactionTonkeeper (transaction: DeLabTransaction): string {
        let url = `https://app.tonkeeper.com/transfer/${transaction.to}?amount=${transaction.value}`

        if (transaction.text) url += `&text=${transaction.text}`
        if (transaction.payload) url += `&bin=${transaction.payload}`
        if (transaction.stateInit) url += `&init=${transaction.stateInit}`

        this.newEvent('approve-link', url)
        return url
    }

    public async connectTonHub (): Promise<DeLabAddress> {
        if (this._sessionTonHub) {
            this.newEvent('link', this._sessionTonHub.link.replace('ton://', 'https://tonhub.com/'))
            const session: TonhubSessionAwaited = await this._connectorTonHub
                .awaitSessionReady(this._sessionTonHub.id, 5 * 60 * 1000) // 5 min timeout

            if (session.state === 'revoked' || session.state === 'expired') {
                this.newEvent('error', session.state)
                // Handle revoked or expired session
            } else if (session.state === 'ready') {
                // console.log(session.wallet)

                this._walletTonHub = session.wallet
                this._address = session.wallet.address
                this._typeConnect = 'tonhub'

                this.sussesConnect()

                DeLabConnect.addStorageData('init',  true)
                DeLabConnect.addStorageData('type-connect',  this._typeConnect)
                DeLabConnect.addStorageData('address',  this._address)
                DeLabConnect.addStorageData('wallet-tonhub',  this._walletTonHub)
                DeLabConnect.addStorageData('session-tonhub',  this._sessionTonHub)
                DeLabConnect.addStorageData('network',  this._network)

                this.closeModal()

                // Handle session

                // ...
            } else {
                throw new Error('Impossible')
            }

            return this._address
        }

        this.newEvent('error-tonhub', 'tonhub_session')

        return undefined

        // throw new Error('Error created TonHub session')
    }

    public async connectToncoinWallet (): Promise<DeLabAddress> {
        if (window.ton) {
            if (window.ton.isTonWallet) {
                console.log(window.ton)

                const address = await window.ton.send('ton_requestAccounts')
                console.log(address)
                if (address) {
                    if (address.length > 0) {
                        if (address[0]) {
                            console.log(address[0])

                            this._address = address[0]
                            this._typeConnect = 'toncoinwallet'

                            this.sussesConnect()

                            DeLabConnect.addStorageData('init',  true)
                            DeLabConnect.addStorageData('type-connect',  this._typeConnect)
                            DeLabConnect.addStorageData('address',  this._address)
                            DeLabConnect.addStorageData('network',  this._network)
                            this.closeModal()
                            return this._address
                        }
                    }
                }

                this.newEvent('error-toncoinwallet', 'account_not_registered')
            } else {
                this.newEvent('error-toncoinwallet', 'error_isTonWallet')
            }
        } else {
            this.newEvent('error-toncoinwallet', 'toncoin_wallet_not_installed')
        }
        return undefined
    }

    public async connectTonkeeper (): Promise<DeLabAddress> {
        const host = this._hostName
        const userId = getRandomArbitrary(10000, 99999999)
        const link = 'https://app.tonkeeper.com/ton-login/' + host + '/authRequest/' + userId

        this.newEvent('link', link)

        const address = await this.interval(`${userId}`)
        if (address) {
            console.log(address)
            this._address = address
            this._typeConnect = 'tonkeeper'

            DeLabConnect.addStorageData('init',  true)
            DeLabConnect.addStorageData('type-connect',  this._typeConnect)
            DeLabConnect.addStorageData('address',  this._address)
            DeLabConnect.addStorageData('network',  this._network)

            this.sussesConnect()
            this.closeModal()
            return this._address
        }
        return undefined
    }

    public on (event: string, listener: EventListener): void {
        this._events.on(event, listener)
    }

    public async sendTransaction (transaction: DeLabTransaction): Promise<any | boolean> {
        if (this._typeConnect) {
            switch (this._typeConnect) {
                case 'tonhub':
                    return this.sendTransactionTonHub(transaction)
                case 'toncoinwallet':
                    return DeLabConnect.sendTransactionToncoinWallet(transaction)
                case 'tonkeeper':
                    return this.sendTransactionTonkeeper(transaction)
                default:
                    throw new Error('Error typeConnect')
            }
        } else {
            // const errorText = 'notConnected'
            // console.log('eee')
            this.newEvent('error', this._typeConnect)
            // this.newEvent('disconnect', true)
        }
        return false
    }

    public disconnect (): boolean {
        this._sessionTonHub = undefined
        this._walletTonHub = undefined
        this._address = undefined
        this._balance = undefined

        this.clearStorage()

        this.newEvent('disconnect', true)
        return true
    }

    public closeModal (): boolean {
        this._isOpenModal = false

        this.newEvent('modal', this._isOpenModal)
        return true
    }

    public async openModal (): Promise<boolean> {
        this._isOpenModal = true
        this.newEvent('modal', this._isOpenModal)
        await this.createTonHub()
        return true
    }

    public get isOpenModal (): boolean {
        return this._isOpenModal
    }

    public get typeConnect (): string | undefined {
        return this._typeConnect
    }

    public get appUrl (): string {
        return this._appUrl
    }

    public get appName (): string {
        return this._appName
    }

    public get address (): string | undefined {
        return this._address
    }

    public get network (): DeLabNetwork {
        return this._network
    }

    public get connectorTonHub (): TonhubConnector {
        return this._connectorTonHub
    }

    public get sessionTonHub (): TonhubCreatedSession | undefined {
        return this._sessionTonHub
    }

    public get walletTonHub (): TonhubWalletConfig | undefined {
        return this._walletTonHub
    }
}

export { DeLabConnect }
