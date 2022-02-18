import { css } from '@emotion/css'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Link from 'next/link'
import { AccountContext } from '../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faTrash } from '@fortawesome/free-solid-svg-icons'
/* import contract address and contract owner address */
import {
  contractAddress, ownerAddress
} from '../config'

/* import Application Binary Interface (ABI) */
import Blog from '../artifacts/contracts/Blog.sol/Blog.json'

export default function Home(props) {
  /* posts are fetched server side and passed in as props */
  /* see getServerSideProps */
  const { posts } = props
  const account = useContext(AccountContext)

  const router = useRouter()
  async function navigate() {
    router.push('/create-post')
  }
  const getId = async (hash) => {
    let provider
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
      provider = new ethers.providers.JsonRpcProvider()
    } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'testnet') {
      provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
    } else {
      provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
    }
    const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
    const val = await contract.fetchPost(hash)
    const postId = val[0].toNumber()
    return postId;
  }
  async function deleteRow(hash) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
    await contract.deletePost(getId(hash))
  }
  console.log(posts);
  return (
    <div>
      <div className={postList}>
        {
          /* map over the posts array and render a button with the post title */
          posts.map((post, index) => (
            <div className={wrapper}>
              <div style={{ width: account === ownerAddress ? "calc(100% - 60px)" : "100%" }}>

                <Link href={`/post/${post[2]}`} key={index}>
                  <a>
                    <div className={linkStyle}>
                      <p className={postTitle}>{post[1]}</p>
                      <div className={arrowContainer}>
                        <img
                          src='/right-arrow.svg'
                          alt='Right arrow'
                          className={smallArrow}
                        />
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
              {
                account === ownerAddress &&
                <button className={buttonDel} onClick={() => { deleteRow(post[2]) }}><FontAwesomeIcon icon={faTrash} /></button>
              }
            </div>
          ))
        }
      </div>
      <div className={container}>
        {
          (account === ownerAddress) && posts && !posts.length && (
            /* if the signed in user is the account owner, render a button */
            <button className={buttonStyle} onClick={navigate}>
              Create your first post
              <img
                src='/right-arrow.svg'
                alt='Right arrow'
                className={arrow}
              />
            </button>
          )
        }
      </div>
    </div>
  )
}
export async function getServerSideProps() {
  /* here we check to see the current environment variable */
  /* and render a provider based on the environment we're in */
  let provider
  // if (typeof window !== "undefined") {
  //   // browser code
  //   const provider2 = new ethers.providers.Web3Provider(window.ethereum)
  //   const { name } = await provider2.getNetwork()
  //   console.log(name);
  // }
  // debugger
  // if (window) {
  //   debugger
  //   const provider2 = new ethers.providers.Web3Provider(window?.ethereum)
  // }
  // debugger
  if (process.env.ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (process.env.ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today')
  } else {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }
  debugger
  const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
  const data = await contract.fetchPosts()

  return {
    props: {
      posts: JSON.parse(JSON.stringify(data))
    }
  }
}
const arrowContainer = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 20px;
`

const postTitle = css`
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  padding: 20px;
`

const linkStyle = css`
  border: 1px solid #ddd;

  border-radius: 8px;
  display: flex;
`

const postList = css`
  width: 700px;
  margin: 0 auto;
  padding-top: 50px;  
`

const container = css`
  display: flex;
  justify-content: center;
`

const buttonStyle = css`
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, .1);
`
const buttonDel = css`
  background-color: #e74c3c;
  color: #fff;
  outline: none;
  border: none;
  font-size: 20px;
  width:50px;
  height:50px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(231, 76, 60,.1);
`
const arrow = css`
  width: 35px;
  margin-left: 30px;
`

const smallArrow = css`
  width: 25px;
`
const wrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
`