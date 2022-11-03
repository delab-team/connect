import {
    AdaptivityProvider,
    AppRoot,
    Avatar,
    Button,
    ConfigProvider,
    Div,
    HorizontalCell,
    HorizontalScroll,
    IconButton,
    IOS,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelHeaderButton,
    SimpleCell,
    WebviewType
} from '@vkontakte/vkui'
import { QRCodeSVG } from 'qrcode.react'
import React, { useEffect, useState } from 'react'
import { Icon20ComputerOutline, Icon20SmartphoneOutline, Icon24Dismiss, Icon28ChevronLeftOutline } from '@vkontakte/icons'

import { DeLabModalConfig } from './types/react'
import { DeLabEvent } from './types/index'

import '@vkontakte/vkui/dist/vkui.css'
import './static/modal.css'
import './static/style.css'

const white = 'https://ipfs.io/ipfs/bafkreigpmboyvo43fa4ybalflby3pb3eg2emgzn7axkgd7rmvrgdpx4oja'
const black = 'https://ipfs.io/ipfs/bafkreibbn3nq6avodph3lcg6qlak6tbjha7levxzwgyk7nyrwot3ajvuwq'
const tonhubLogo = 'https://ipfs.io/ipfs/bafkreidr3kjxine5hgjxq45ybgqep5vr7lh5kldhyjbzvhh2hd2ukyuae4'
const tonkeeperLogo = 'https://ipfs.io/ipfs/bafkreia4powgq5jmqpgffbvxqlwjfecnafx2qx4lfpywsloz3ikffnnmya'
const justonLogo = 'https://ipfs.io/ipfs/bafkreicsxkyeim2dtcffk7gnn37h3p5eidv65oj5vyfpei2qvh5q7rxuva'
const toncoinwalletLogo = 'https://ipfs.io/ipfs/bafkreidzi6kpvacf67lb5n45gjhrx2jhv3fjmr4kl5zmeqw7ks3wemfuqe'
const mytonwalletLogo = 'https://ipfs.io/ipfs/bafkreiaqubymrwvbj7pojsdze57ieyiqnr2h6ugz6bfiwatxoy5exxrxnu'
const unitonLogo = 'https://ipfs.io/ipfs/bafkreiau7rwd6yozcqraur275phxn3k3t7rgrbjbd57fpksexnqjpadq64'

const DeLabModal: React.FC<DeLabModalConfig> = (props: DeLabModalConfig) => {
    const [ firstRender, setFirstRender ] = useState<boolean>(false)
    const [ type, setType ] = useState<number>(0)
    const [ link, setLink ] = useState<string>('')

    const [ activeModal, setActiveModal ] = useState<string | null>(null)

    const [ isOpenModal, setIsOpenModal ] = useState<boolean>(false)

    const ConfigProviderFix: any = ConfigProvider
    const AdaptivityProviderFix: any = AdaptivityProvider

    const isDesktop = window.innerWidth >= 600

    function registerListen () {
        props.DeLabConnectObject.on('modal', (data: DeLabEvent) => {
            setIsOpenModal(data.data ?? false)

            setActiveModal(data.data ? 'connect' : null)
            // console.log('modal', data.data)
        })

        props.DeLabConnectObject.on('link', (data: DeLabEvent) => {
            setLink(data.data ?? '')
            setType(1)
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
        }
    }, [])

    return (
        <div className={'delab-modal-root ' + (isOpenModal ? 'delab-modal-root-active' : '')}>
            <ConfigProviderFix
                appearance={props.scheme}
                webviewType={WebviewType.INTERNAL}
                platform={IOS}
            >
                <AdaptivityProviderFix >
                    <AppRoot>
                        <ModalRoot activeModal={activeModal}>
                            <ModalPage
                                id="connect"
                                // style={{minHeight: '220px'}}
                                onClose={() => props.DeLabConnectObject.closeModal()}
                                header={<ModalPageHeader
                                    before={type === 1
                                        ? <IconButton onClick={() => {
                                            setType(0)
                                            setLink('')
                                        }}><Icon28ChevronLeftOutline /></IconButton> : null}
                                    after={ isDesktop
                                        ? null : <PanelHeaderButton
                                            onClick={() => props.DeLabConnectObject.closeModal()}>
                                            <Icon24Dismiss />
                                        </PanelHeaderButton>
                                    }
                                ><img src={props.scheme === 'dark' ? white : black} className="delab-logo" />DeLab Connect</ModalPageHeader>}
                            >

                                <div>
                                    {type === 0
                                        ? <div>
                                            <SimpleCell
                                                disabled
                                                className="delab_text"
                                                before={<Icon20SmartphoneOutline fill="var(--text_primary)" />}
                                            >
                                        Mobile
                                            </SimpleCell>
                                            <HorizontalScroll showArrows={false}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <HorizontalCell size="l" header="Tonhub" onClick={() => props.DeLabConnectObject.connectTonHub()}>
                                                        <Avatar
                                                            size={60}
                                                            mode="app"
                                                            src={tonhubLogo}
                                                        />
                                                    </HorizontalCell>

                                                    <HorizontalCell size="l" header="Tonkeeper" onClick={() => props.DeLabConnectObject.connectTonkeeper()}>
                                                        <Avatar
                                                            size={60}
                                                            mode="app"
                                                            src={tonkeeperLogo}
                                                        />
                                                    </HorizontalCell>

                                                    <HorizontalCell size="l" header="JUSTON" disabled>
                                                        <Avatar
                                                            size={60}
                                                            mode="app"
                                                            src={justonLogo}
                                                        />
                                                    </HorizontalCell>

                                                </div>
                                            </HorizontalScroll>

                                            <SimpleCell
                                                disabled
                                                className="delab_text"
                                                before={<Icon20ComputerOutline fill="var(--text_primary)" />}
                                            >
                                                Desktop
                                            </SimpleCell>

                                            <HorizontalScroll showArrows={false}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <HorizontalCell size="l" header="Ton Wallet" onClick={() => props.DeLabConnectObject.connectToncoinWallet()}>
                                                        <Avatar
                                                            size={60}
                                                            mode="app"
                                                            src={toncoinwalletLogo}
                                                        />
                                                    </HorizontalCell>

                                                    <HorizontalCell size="l" header="MyTonWallet" onClick={() => props.DeLabConnectObject.connectToncoinWallet()}>
                                                        <Avatar
                                                            size={60}
                                                            mode="app"
                                                            src={mytonwalletLogo}
                                                        />
                                                    </HorizontalCell>

                                                    <HorizontalCell size="l" header="Uniton" disabled>
                                                        <Avatar
                                                            size={60}
                                                            mode="app"
                                                            src={unitonLogo} />
                                                    </HorizontalCell>

                                                </div>
                                            </HorizontalScroll>

                                            <Div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Button
                                                    className="delab_lern"
                                                    target="_blank"
                                                    href="https://github.com/delab-team/connect"
                                                >Learn More</Button>
                                            </Div>
                                        </div>
                                        : null }
                                    {type === 1 && link !== ''
                                        ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '220px' }}>
                                            <div style={{ borderRadius: '20px', padding: '20px', background: '#fff', marginBottom: '20px' }}>
                                                <QRCodeSVG value={link} width={200} height={200} />
                                            </div>
                                            {isDesktop
                                                ? <Button target="_blank" href={link} stretched size="m">Open Wallet</Button>
                                                : <Div style={{ width: '90%' }}>
                                                    <Button target="_blank" href={link} stretched size="m">Open Wallet</Button>
                                                </Div>
                                            }

                                        </div>
                                        : null}
                                </div>
                            </ModalPage>
                        </ModalRoot>
                    </AppRoot>
                </AdaptivityProviderFix>
            </ConfigProviderFix>
        </div>
    )
}

export { DeLabModal }
