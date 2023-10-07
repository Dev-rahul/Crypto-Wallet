import { useState, useEffect, useRef } from 'react'
import Web3 from 'web3'
import SvgIcon from '@mui/material/SvgIcon'
import LoadingButtonComponent from './components/loadingButton'
import Ether from './assets/icons/ethereum.svg'
import Matic from './assets/icons/matic.svg'
import AddContactDialog from './components/addContact'
import IconButton from '@mui/material/IconButton'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ContactsList from './components/contactList'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import Tooltip from '@mui/material/Tooltip'
import SplitPaymentDialog from './components/splitPayment'
import Dashboard from './components/dashboard'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [addContactOpen, AddContactOpen] = useState(false)
  const [splitPaymentOpen, setSplitPaymentOpen] = useState(false)
  const [myContacts, setMyContact] = useState([])
  const [myWeb3, setMyWeb3] = useState(null)

  const contactListRef = useRef(null)

  useEffect(() => {
    const walletInfo = JSON.parse(sessionStorage.getItem('walletInfo'))
    if (walletInfo != null) {
      setUserInfo(walletInfo)
      setIsConnected(true)
    }
  }, [])

  const detectCurrentProvider = () => {
    let provider
    if (window.ethereum) {
      provider = window.ethereum
    } else if (window.web3) {
      provider = window.web3.currentProvider
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
    return provider
  }

  useEffect(() => {
    onConnect()
  }, [])

  const onConnect = async () => {
    setIsLoading(true)
    try {
      const currentProvider = detectCurrentProvider()
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          )
        }
        await currentProvider.request({
          method: 'eth_requestAccounts',
          params: [{ chainId: Web3.utils.toHex(3) }],
        })
        const web3 = new Web3(currentProvider)
        const userAccount = await web3.eth.getAccounts()
        const chainID = await web3.eth.getChainId()
        const account = userAccount[0]
        let ethBalance = await web3.eth.getBalance(account)
        ethBalance = web3.utils.fromWei(ethBalance, 'ether')
        saveUserInfo(ethBalance, account, chainID)
        setIsLoading(false)
        setMyWeb3(web3)
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask')
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      )
    }
  }

  const onDisconnect = () => {
    window.sessionStorage.removeItem('walletInfo')
    setUserInfo({})
    setIsConnected(false)
  }

  const upDateBalance = async () => {
    if (userInfo?.account) {
      var bal = await myWeb3.eth.getBalance(userInfo.account)
      let ethBalance = myWeb3.utils.fromWei(bal, 'ether')
      setUserInfo((prevState) => ({
        ...prevState,
        balance: ethBalance,
      }))
    }
  }

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    }
    window.sessionStorage.setItem('walletInfo', JSON.stringify(userAccount)) //user persisted data
    const walletData = JSON.parse(sessionStorage.getItem('walletInfo'))
    setUserInfo(walletData)
    setIsConnected(true)
  }

  const switchNetwork = async () => {
    setIsLoading(true)
    const newChainID = userInfo.connectionid === 3 ? 80001 : 3
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(newChainID) }],
      })
    } catch (err) {
      console.log(err)
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Polygon Testnet',
              chainId: web3.utils.toHex(chainId),
              nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
              rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            },
          ],
        })
      }
    }
    updateWallet()
    setIsLoading(false)
  }

  const updateWallet = async () => {
    const currentProvider = detectCurrentProvider()
    if (currentProvider) {
      await currentProvider.request({ method: 'eth_requestAccounts' })
      const web3 = new Web3(currentProvider)
      const userAccount = await web3.eth.getAccounts()
      const chainID = await web3.eth.getChainId()
      const account = userAccount[0]
      let ethBalance = await web3.eth.getBalance(account)
      ethBalance = web3.utils.fromWei(ethBalance, 'ether')
      setMyWeb3(web3)
      console.log(ethBalance, account, chainID)
      saveUserInfo(ethBalance, account, chainID)
    }
  }

  const openAddContact = () => {
    AddContactOpen(true)
  }

  const closeAddContact = () => {
    AddContactOpen(false)
  }

  const openSplitPayment = () => {
    setSplitPaymentOpen(true)
  }

  const closeSplitPayment = () => {
    setSplitPaymentOpen(false)
  }

  const submitContactForm = (data) => {
    console.log(data)
    updateContacts(data)
  }

  const updateContacts = (item) => {
    let prevContacts = [...myContacts]
    prevContacts.push(item)
    setMyContact(prevContacts)
  }

  return (
    <div>
      <div
        style={{
          width: '765px',
          height: '365px',
          right: '-119px',
          top: '-98px',
          background: '#ffe5a3',
          position: 'fixed',
          filter: 'blur(200px)',
          zIndex: '-1',
        }}
      ></div>

      <div
        style={{
          width: '907px',
          height: '527px',
          left: '-119px',
          top: '643px',
          background: '#ffa3e0',
          position: 'fixed',
          filter: 'blur(200px)',
          zIndex: '-1',
        }}
      ></div>
      <div className='m-10 flex flex-col justify-center items-center '>
        <div className='text-center mb-10'></div>
        <div className='text-center'>
          {!isConnected && (
            <div>
              <LoadingButtonComponent
                text='Connect your Wallet'
                action={onConnect}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
        {isConnected && (
          <div>
            <AddContactDialog
              closeAddContact={closeAddContact}
              open={addContactOpen}
              web3={myWeb3}
              submitContactForm={submitContactForm}
            />
            <SplitPaymentDialog
              closeSplitPayment={closeSplitPayment}
              open={splitPaymentOpen}
              web3={myWeb3}
              contacts={myContacts}
              userInfo={userInfo}
              addTransaction={contactListRef.current?.addTransactions}
              upDateBalance={upDateBalance}
            />

            <div className=' border border-500 rounded-t-xl bg-black  shadow-md '>
              <div className='p-4 text-white rounded-t-xl'>
                <div className='p-4'>
                  <span>Address : </span>
                  {userInfo.account}
                </div>

                <Dashboard userInfo={userInfo} />
              </div>
              <div className='flex flex-col justify-center items-start border  rounded-t-xl  p-5 bg-white '>
                <div className='flex justify-between w-full'>
                  <Tooltip title='Add Contact' placement='right'>
                    <IconButton
                      aria-label='add'
                      size='large'
                      onClick={openAddContact}
                    >
                      <AddCircleIcon fontSize='inherit' />
                    </IconButton>
                  </Tooltip>
                  <LoadingButtonComponent
                    text={
                      userInfo.connectionid === 3
                        ? 'Switch to Polygon'
                        : 'Switch to Ethereum'
                    }
                    action={switchNetwork}
                    isLoading={isLoading}
                    endIcon={
                      userInfo.connectionid === 3 ? (
                        <SvgIcon component={Matic} viewBox='0 0 1100 1000  ' />
                      ) : (
                        <SvgIcon component={Ether} viewBox='0 0 600 476.6' />
                      )
                    }
                  />
                  <Tooltip title='Split' placement='left'>
                    <IconButton
                      aria-label='add'
                      size='large'
                      onClick={openSplitPayment}
                    >
                      <CallSplitIcon fontSize='inherit' />
                    </IconButton>
                  </Tooltip>
                </div>

                {/* <Divider variant="middle" /> */}
                <ContactsList
                  contacts={myContacts}
                  balance={userInfo.balance}
                  web3={myWeb3}
                  userInfo={userInfo}
                  ref={contactListRef}
                  upDateBalance={upDateBalance}
                />
              </div>
              <div className='bg-white'>
                <h2>✅ You are connected to metamask.</h2>
                <button className='text-center' onClick={onDisconnect}>
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
