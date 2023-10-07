import React, { useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import Ether from '../assets/icons/ethereum.svg'
import Matic from '../assets/icons/matic.svg'
import TransactionsList from './listTransactions';
import AmountField from './inputText';


function ContactsList(props, ref) {
    const { contacts, balance, web3, userInfo, upDateBalance } = props
    const [currency, setCurrency] = useState(0)
    //const [amount, setAmount] = useState(0)
    const [transactions, setTransactions] = useState({})





    // const currencyChange = (event) => {
    //     setCurrency(event.target.value);
    // }

    // const amountChange = (event) => {
    //     setAmount(event.target.value);
    // }

    const onSend = async (contact, amount) => {
        const tranAmount = amount;
        console.log(`payWithMetamask(receiver=${contact.address}, sender=${userInfo.account}, strEther=${amount})`)
        //payMeta(userInfo.account,contact.address,amount)
        console.log(web3);
        console.log(web3.utils.isAddress(contact.address));
        try {

            const transactionData = await web3.eth.sendTransaction({ to: contact.address, from: userInfo.account, value: web3.utils.toWei(amount, "ether") })
            console.log('txnHash is ', transactionData);
            addTransactions(contact.address, transactionData, tranAmount)
            upDateBalance()
            //var receipt = await web3.eth.getTransactionReceipt(transactionData.transactionHash)
            //console.log('txndata ' , web3.utils.fromWei(transactionData.effectiveGasPrice, 'ether'));
        } catch (e) {
            console.log("payment fail!");
            console.log(e);
        }



    }
    useImperativeHandle(ref, () => ({
        addTransactions
    }));


    const addTransactions = async (contact, data, value) => {
        console.log(contact, 'prevstate1');

        let prevState = { ...transactions }
        if (contact in prevState) {
            prevState[contact].push({ value: value, hash: data.transactionHash, date: new Date(), blockExpUrl: userInfo.connectionid === 3 ? `https://ropsten.etherscan.io/tx/${data.transactionHash}` : `https://mumbai.polygonscan.com/tx/${data.transactionHash}`, id: userInfo.connectionid })
        } else { prevState[contact] = [{ value: value, hash: data.transactionHash, date: new Date(), blockExpUrl: userInfo.connectionid === 3 ? `https://ropsten.etherscan.io/tx/${data.transactionHash}` : `https://mumbai.polygonscan.com/tx/${data.transactionHash}`, id: userInfo.connectionid }] }


        console.log(prevState, 'prevstate');
        setTransactions(prevState)
    }



    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {contacts.map((contact, index) => {
                return (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar>{contact.contactName.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={contact.contactName}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {contact.address}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                width: '400px',
                                                alignItems: 'space-between',
                                                '& > :not(style)': { m: 1 },
                                            }}
                                        >
                                            <AmountField userInfo={userInfo} balance={balance} contact={contact} onSend={onSend} />
                                        </Box>
                                        <TransactionsList transactions={transactions[contact.address]} currency={currency} />
                                    </React.Fragment>
                                }
                            />

                        </ListItem>

                        <Divider className="w-full" variant="inset" component="li" />
                    </React.Fragment>
                )
            })}


        </List>
    );
}

export default forwardRef(ContactsList)

