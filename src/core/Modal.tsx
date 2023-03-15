import React, { useEffect, useRef, useState } from 'react'
import { Icon24Dismiss, Icon28ChevronLeftOutline } from '@vkontakte/icons'
import QRCodeStyling from 'qr-code-styling'
import { WalletInfo } from '@tonconnect/sdk'

import { DeLabModalConfig } from './types/react'
import { DeLabEvent } from './types/index'

import * as QRoptions from './qr.json'

import './static/modal.css'
import './static/style.css'

import white from './static/img/white.png'
import black from './static/img/black.png'

import tonhubLogo from './static/img/tonhub.png'
import tonkeeperLogo from './static/img/tonkeeper.png'
import toncoinwalletLogo from './static/img/toncoin.png'

const options: any = QRoptions
const qrCode = new QRCodeStyling(options)

const DeLabModal: React.FC<DeLabModalConfig> = (props: DeLabModalConfig) => {
    const [ firstRender, setFirstRender ] = useState<boolean>(false)
    const [ type, setType ] = useState<number>(0)
    const [ link, setLink ] = useState<string>('')

    const [ isOpenModal, setIsOpenModal ] = useState<boolean>(false)

    const [ tonConnectWallets, setTonConnectWallets ] = useState<Array<WalletInfo>>([])

    const isDesktop = window.innerWidth >= 700

    const ref = useRef<HTMLDivElement | null>(null)

    function openLink (url: string) {
        const link2 = document.createElement('a')
        link2.href = url
        link2.target = '_blank'
        link2.click()
    }

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
            if (!isDesktop) openLink(data.data)

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
                        <a target="_blank"
                            href="https://delab.team">  <span>DeLab Connect</span></a>
                    </div>
                    <div className="delab-modal-header-right" onClick={() => props.DeLabConnectObject.closeModal()}>
                        <Icon24Dismiss />
                    </div>
                </div>

                {type === 0
                    ? <div className="delab-modal-content">

                        <div className="delab-modal-horizontal">
                            <div className="delab-modal-horizontal-block" onClick={() => props.DeLabConnectObject.connectTonHub()}>
                                <div className="delab-icon">
                                    <img src={tonhubLogo} />
                                </div>
                                <span>
                            Tonhub
                                </span>
                            </div>

                            <div className="delab-modal-horizontal-block" onClick={() => setType(2)}>
                                <div className="delab-icon">
                                    <img src={tonkeeperLogo} />
                                </div>
                                <span>
                            Ton Connect 2.0
                                </span>
                            </div>

                            <div className="delab-modal-horizontal-block" onClick={() => props.DeLabConnectObject.connectToncoinWallet()}>
                                <div className="delab-icon">
                                    <img src={toncoinwalletLogo} />
                                </div>
                                <span>
                            Web Ton Wallets
                                </span>
                            </div>

                        </div>
                    </div>
                    : null }
                {type === 2
                    ? <div className="delab-modal-content">
                        <div className="delab-modal-text-icon delab_text">
                        Ton Connect 2.0
                        </div>
                        <div style={{ height: '260px', overflowY: 'scroll' }}>

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
                        </div>
                    </div>
                    : null
                }
                {type === 1 ? <div className="delab-modal-content">
                    <div className="delab-center-block2">
                        {isDesktop ? <a target="_blank" href={link}>
                            <div className="qr-delab">
                                <div ref={ref} />
                            </div></a>
                            : <a className='delab-button delab-button-large' target="_blank" href={link}>
                        Open Wallet
                            </a>
                        }
                    </div>

                </div>
                    : null
                }
            </div>
        </div>
    )
}

export { DeLabModal }
