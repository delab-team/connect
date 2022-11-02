
import React, { useEffect } from 'react'
import { DeLabModal, DeLabButton, DeLabConnect } from '../../DeLab Connect/dist'

import {
    DeLabNetwork,
    DeLabTypeConnect,
    DeLabAddress,
    DeLabConnecting,
    DeLabTransaction,
    DeLabEvent
} from '../../DeLab Connect/dist'
import { QRCodeSVG } from 'qrcode.react'

const DeLabConnector = new DeLabConnect('https://google.com', 'Test')

export const App: React.FC = () => {

    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const [ isConnected, setIsConnected ] = React.useState<boolean>(false)
    const [ address, setAddress ] = React.useState<DeLabAddress>(undefined)
    const [ network, setNetwork ] = React.useState<DeLabNetwork>('mainnet')
    const [ typeConnect, setTypeConnect ] = React.useState<DeLabTypeConnect>(undefined)

    const [ dataTx, setDataTx ] = React.useState<any>(null)

    const [ approveLink, setApproveLink ] = React.useState<string>('')

    async function sendTransaction () {
        const trans: DeLabTransaction = {
            to: 'EQCkR1cGmnsE45N4K0otPl5EnxnRakmGqeJUNua5fkWhales',
            value: '1000000'
        }
        const dataTx2 = await DeLabConnector.sendTransaction(trans)
        setDataTx(dataTx2)
    }

    function listenDeLab () {
        DeLabConnector.on('connect', (data: DeLabEvent) => {
            setIsConnected(true)
            const connectConfig: DeLabConnecting = data.data
            setAddress(connectConfig.address)
            setTypeConnect(connectConfig.typeConnect)
            setNetwork(connectConfig.network)
        })

        DeLabConnector.on('disconnect', () => {
            setIsConnected(false)
            setAddress(undefined)
            setTypeConnect(undefined)
            setNetwork('mainnet')
            console.log('disconect')
        })

        DeLabConnector.on('approve-link', (data: DeLabEvent) => {
            setApproveLink(data.data ?? '')
        })

        DeLabConnector.on('error', (data: DeLabEvent) => {
            console.log('error-> ', data.data)
        })

        DeLabConnector.on('error-transaction', (data: DeLabEvent) => {
            console.log('error-transaction-> ', data.data)
        })

        DeLabConnector.on('error-toncoinwallet', (data: DeLabEvent) => {
            console.log('error-toncoinwallet-> ', data.data)
        })

        DeLabConnector.on('error-tonhub', (data: DeLabEvent) => {
            console.log('error-tonhub-> ', data.data)
        })

        DeLabConnector.on('error-tonkeeper', (data: DeLabEvent) => {
            console.log('error-tonkeeper-> ', data.data)
        })

        DeLabConnector.loadWallet()
    }

    useEffect(() => {
        if (!firstRender && DeLabConnector) {
            setFirstRender(true)
            listenDeLab()
        }
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '550px', paddingTop: '20px'}}>
                    {!isConnected  ? 
                        <DeLabButton DeLabConnectObject={DeLabConnector} scheme={'light'} /> 
                    : null }

                    {isConnected ? <div>
                        <h3>Info block</h3>
                        <p>isConnected: {isConnected ? 'Connected' : 'Disconnected'}</p>
                        <p>typeConnect: {typeConnect}</p>
                        <p>network: {network}</p>
                        <p>address: {address}</p>
                        <button onClick={() => DeLabConnector.disconnect()}>
                            Disconnect
                        </button>
                        <h3>Send transaction</h3>
                        <button onClick={() => sendTransaction()}>
                            Send test transaction
                        </button>
                        <p>transaction: {JSON.stringify(dataTx)}</p>
                        {approveLink !== '' ?
                            <div style={{ borderRadius: '20px', padding: '20px', background: '#fff', marginBottom: '20px', width: '220px' }}>
                                <QRCodeSVG value={approveLink} width={200} height={200} />
                                </div>
                        : null}
                    </div> : null }
                </div>
            </div>
            <DeLabModal DeLabConnectObject={DeLabConnector} scheme={'light'} />
        </div>
    )
}
