import '../styles/globals.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { AccountContext } from '../context.js'
import { ownerAddress } from '../config'
import 'easymde/dist/easymde.min.css'

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState(null)
  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID
          },
        },
      },
    })
    return web3Modal
  }
  /* the connect function uses web3 modal to connect to the user's wallet */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
    } catch (err) {
      console.log('error:', err)
    }
  }
  // useEffect(async () => {
  //   const [account] = await window.ethereum.request({
  //     method: 'eth_requestAccounts',
  //   })
  //   console.log(account);
  //   setAccount(account)
  // }, [])

  return <div>
    <nav className={nav}>
      <div className={header}>
        <Link href="/">
          <a>
            <div className={titleContainer}>
              <h2 className={title}>Collect Blog</h2>
              <p className={description}>WEB3 nambv</p>
            </div>
          </a>
        </Link>
        {
          !account && (
            <div className={buttonContainer}>
              <button className={buttonStyle} onClick={connect}>Connect</button>
            </div>
          )
        }
        {
          account && <p className={accountInfo}>{account}</p>
        }
      </div>
      {
        (account === ownerAddress) &&
        <div className={linkContainer}>
          <Link href="/create-post">
            <a className={link}>
              Create Post
            </a>
          </Link>
        </div>
      }
    </nav>
    <div className={container}>
      <AccountContext.Provider value={account}>
        <Component {...pageProps} connect={connect} />
      </AccountContext.Provider>
    </div>
  </div>
}
const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`

const container = css`
  padding: 40px;
  padding-top:0;
`

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`

const nav = css`
  background-color: white;
`

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, .075);
  padding: 20px 30px;
  background: rgb(34,193,195);
background: linear-gradient(90deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%); 
`

const description = css`
  margin: 0;
  color: #fff;
`

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`

const title = css`
  margin-left: 30px;
  font-weight: 700;
  margin: 0;
  color: white;

`

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

const buttonStyle = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 16px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`

const link = css`
  margin: 0px 40px 0px 0px;
  font-size: 16px;
  font-weight: 400;
`

export default MyApp
