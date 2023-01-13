import React, { useEffect, useRef, useState } from 'react'
import { Icon20ComputerOutline, Icon20SmartphoneOutline, Icon24Dismiss, Icon28ChevronLeftOutline } from '@vkontakte/icons'
import QRCodeStyling from 'qr-code-styling'
import { WalletInfo } from '@tonconnect/sdk'

import { DeLabModalConfig } from './types/react'
import { DeLabEvent } from './types/index'

import * as QRoptions from './qr.json'

import './static/modal.css'
import './static/style.css'

const white = 'https://ipfs.filebase.io/ipfs/bafkreigpmboyvo43fa4ybalflby3pb3eg2emgzn7axkgd7rmvrgdpx4oja'
const black = 'https://ipfs.filebase.io/ipfs/bafkreibbn3nq6avodph3lcg6qlak6tbjha7levxzwgyk7nyrwot3ajvuwq'
const tonhubLogo = 'https://ipfs.filebase.io/ipfs/bafkreidr3kjxine5hgjxq45ybgqep5vr7lh5kldhyjbzvhh2hd2ukyuae4'
const tonkeeperLogo = 'https://ipfs.filebase.io/ipfs/bafkreia4powgq5jmqpgffbvxqlwjfecnafx2qx4lfpywsloz3ikffnnmya'
const justonLogo = 'https://ipfs.filebase.io/ipfs/bafkreicsxkyeim2dtcffk7gnn37h3p5eidv65oj5vyfpei2qvh5q7rxuva'
const toncoinwalletLogo = 'https://ipfs.filebase.io/ipfs/bafkreidzi6kpvacf67lb5n45gjhrx2jhv3fjmr4kl5zmeqw7ks3wemfuqe'
const mytonwalletLogo = 'https://ipfs.filebase.io/ipfs/bafkreieneuwnw2rphzuhqz42mz4biq3tzhu3ixnq25w65u267a6m7nwhta'
const unitonLogo = 'https://ipfs.filebase.io/ipfs/bafkreickysl5sqig4r2qbna4mv7kd6eslpwrmq6w435f6rkiwqj7ujmexq'

const options: any = QRoptions
const qrCode = new QRCodeStyling(options)

const DeLabModal: React.FC<DeLabModalConfig> = (props: DeLabModalConfig) => {
    const [ firstRender, setFirstRender ] = useState<boolean>(false)
    const [ type, setType ] = useState<number>(0)
    const [ link, setLink ] = useState<string>('')

    const [ isOpenModal, setIsOpenModal ] = useState<boolean>(false)

    const [ tonConnectWallets, setTonConnectWallets ] = useState<Array<WalletInfo>>([])

    const ref = useRef<HTMLDivElement | null>(null)

    function registerListen () {
        props.DeLabConnectObject.on('modal', (data: DeLabEvent) => {
            setIsOpenModal(data.data ?? false)

            if (!data.data) {
                setType(0)
                setLink('')
            }
        })

        props.DeLabConnectObject.on('link', (data: DeLabEvent) => {
            setLink(data.data ?? '')
            setType(1)

            console.log('link', data.data)

            const typeWallet = data.data.indexOf('tonhub') > -1

            // const tonconnectImg = props.DeLabConnectObject.tonConnectWallet?.imageUrl

            qrCode.update({
                data: data.data,
                image: typeWallet ? tonhubLogo : tonkeeperLogo
            })
        })

        props.DeLabConnectObject.on('connected', () => {
            setIsOpenModal(false)
            setType(0)
            setLink('')
        })
    }

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
            registerListen()

            document.body.setAttribute('scheme', props.scheme === 'dark' ? 'space_gray' : 'bright_light')
        }
    }, [])

    useEffect(() => {
        qrCode.append(ref.current ?? undefined)
    }, [ type ])

    useEffect(() => {
        setTonConnectWallets(props.DeLabConnectObject.tonConnectWallets ?? [])
    }, [ props.DeLabConnectObject.tonConnectWallets ])

    return (
        <div className={'delab-modal-root ' + (isOpenModal ? 'delab-modal-root-active' : '')}>
            <div className='delab-modal-block'>
                <div className="delab-modal-header">
                    <div
                        className={'delab-modal-header-left' + (type === 0 ? ' delab-disable' : '') }
                        onClick={() => {
                            setType(0)
                            setLink('')
                        }}
                    >
                        <Icon28ChevronLeftOutline width={24} height={24} />
                    </div>
                    <div className="delab-modal-header-center">
                        <img src={props.scheme === 'dark' ? white : black} className="delab-logo delab-logo2" />
                        <span>DeLab Connect</span>
                    </div>
                    <div className="delab-modal-header-right" onClick={() => props.DeLabConnectObject.closeModal()}>
                        <Icon24Dismiss />
                    </div>
                </div>

                {type === 0
                    ? <div className="delab-modal-content">
                        <div className="delab-modal-text-icon delab_text">
                            <Icon20SmartphoneOutline fill="var(--de_lab_color)" />
                        Mobile
                        </div>

                        <div className="delab-modal-horizontal">
                            <div className="delab-modal-horizontal-block" onClick={() => props.DeLabConnectObject.connectTonHub()}>
                                <div className="delab-icon">
                                    <img src={tonhubLogo} />
                                </div>
                                <span>
                            Tonhub
                                </span>
                            </div>

                            {tonConnectWallets.map((wallet: any, key) => (
                                <div className="delab-modal-horizontal-block" key={key}
                                    onClick={
                                        () => props.DeLabConnectObject.connectTonkeeper(
                                            wallet
                                        )
                                    }>
                                    <div className="delab-icon">
                                        <img src={wallet.imageUrl} />
                                    </div>
                                    <span>
                                        {wallet.name}
                                    </span>
                                </div>
                            ))}

                            <div className="delab-modal-horizontal-block delab-disalbe">
                                <div className="delab-icon">
                                    <img src={justonLogo} />
                                </div>
                                <span>
                            JUSTON
                                </span>
                            </div>

                        </div>

                        <div className="delab-modal-text-icon delab_text">
                            <Icon20ComputerOutline fill="var(--de_lab_color)" />
                        Desktop
                        </div>

                        <div className="delab-modal-horizontal">

                            <div className="delab-modal-horizontal-block" onClick={() => props.DeLabConnectObject.connectToncoinWallet()}>
                                <div className="delab-icon">
                                    <img src={toncoinwalletLogo} />
                                </div>
                                <span>
                            Ton Wallet
                                </span>
                            </div>

                            <div className="delab-modal-horizontal-block" onClick={() => props.DeLabConnectObject.connectToncoinWallet()}>
                                <div className="delab-icon">
                                    <img src={mytonwalletLogo} />
                                </div>
                                <span>
                            MyTonWallet
                                </span>
                            </div>

                            <div className="delab-modal-horizontal-block" onClick={() => props.DeLabConnectObject.connectToncoinWallet()}>
                                <div className="delab-icon">
                                    <img src={unitonLogo} />
                                </div>
                                <span>
                            Uniton
                                </span>
                            </div>
                        </div>

                        <div className="delab-center-block">
                            <a className='delab_lern'
                                target="_blank"
                                href="https://github.com/delab-team/connect"
                            >
                            Learn More
                            </a>
                        </div>
                    </div>
                    : <div className="delab-modal-content">
                        <div className="delab-center-block2">
                            <div className="qr-delab">
                                <div ref={ref} />
                            </div>
                            <a className='delab-button' target="_blank" href={link}>
                        Open Wallet
                            </a>
                        </div>

                    </div>
                }
            </div>
        </div>
    )
}

export { DeLabModal }
