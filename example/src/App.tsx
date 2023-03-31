
import React, { useEffect } from 'react'
import { DeLabModal, DeLabButton, DeLabConnect } from '@delab-team/connect'

import {
    DeLabNetwork,
    DeLabTypeConnect,
    DeLabAddress,
    DeLabConnecting,
    DeLabTransaction,
    DeLabEvent
} from '@delab-team/connect'
import { QRCodeSVG } from 'qrcode.react'

const DeLabConnector = new DeLabConnect('https://google.com', 'Test', 'mainnet')

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
            to: 'EQAgfrO5OwCDzm30rcxC0o49BBhaPPdPQAW8BgEbewPLJhgk',
            value: '100000000',
            text: 'Test pay'
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
        <div style={{
            height: '100vh', 
            background: '#161726', 
            color: '#fff',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(https://ipfs.io/ipfs/bafybeiemkofqtjsvywfk53xthpv5dqwmpszrzvcaxf4ftfec6ixll5mi5a)`,
            backgroundSize: `cover`
            }}>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    width: '650px', 
                    backgroundColor: isConnected ? '#00000059' : 'transparent',
                    borderRadius: '20px',
                    padding: '20px',
                    marginTop: '20px',
                    height: '80vh'
                }}>
                    {!isConnected  ? 
                        <DeLabButton DeLabConnectObject={DeLabConnector} scheme={'dark'} /> 
                    : null }

                    {isConnected ? <div>
                        <h3>Info block</h3>
                        <p>isConnected: {isConnected ? 'Connected' : 'Disconnected'}</p>
                        <p>typeConnect: {typeConnect}</p>
                        <p>network: {network}</p>
                        <p>address: {address ? `${address.substr(0, 5)}...${address.substr(address.length - 5, address.length)}` : ``}</p>
                        <button onClick={() => DeLabConnector.disconnect()}>
                            Disconnect
                        </button>
                        <h3>Send transaction</h3>
                        <button onClick={() => sendTransaction()}>
                            Send test transaction
                        </button>
                        <p>transaction: {JSON.stringify(dataTx)}</p>
                        {approveLink !== '' ?
                            <div style={{ borderRadius: '20px', padding: '20px', background: '#fff', marginBottom: '20px', width: '200px' }}>
                                <QRCodeSVG value={approveLink} width={200} height={200} />
                                </div>
                        : null}
                    </div> : null }
                </div>
            </div>
            <DeLabModal DeLabConnectObject={DeLabConnector} scheme={'dark'} />
        </div>
    )
}
