import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SwitchesGroup from './contactSwitch'
import OutlinedInput from '@mui/material/OutlinedInput';
import SvgIcon from '@mui/material/SvgIcon';
import Ether from '../assets/icons/ethereum.svg'
import Matic from '../assets/icons/matic.svg'
import InputAdornment from '@mui/material/InputAdornment';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function SplitPaymentDialog(props) {
    const { open, web3, closeSplitPayment, contacts, userInfo, addTransaction,upDateBalance } = props

    const [switchData, setSwitchData] = useState({})
    const [isSelected, setIsSelected] = useState(false)
    const [selectedContacts, setSelectedContacts] = useState([])
    const [amount, setAmount] = useState(0)


    useEffect(() => {
        let tempSwitchState = {}
        contacts.forEach(element => {
            tempSwitchState[element.address] = true;
        });
        setSwitchData(tempSwitchState)


    }, [contacts]);


    const handleChange = (event) => {
        let count = 0
        if (event.target.checked === false) {
            for (var key in switchData) {
                if (switchData.hasOwnProperty(key)) {
                    if (switchData[key] === true) {
                        count++
                    }

                }
            }
            if (count > 1) {
                setSwitchData({
                    ...switchData,
                    [event.target.name]: event.target.checked,
                });
            }

        } else {
            setSwitchData({
                ...switchData,
                [event.target.name]: event.target.checked,
            });
        }



    }

    const handleSubmit = () => {
        setIsSelected(true)
        let tempArray = []
        for (var key in switchData) {
            if (switchData.hasOwnProperty(key)) {
                if (switchData[key] === true) {
                    tempArray.push(key)
                }

            }
        }
        setSelectedContacts(tempArray)

    }

    const handleTransfer = () => {
        handleClose();
        let amountToEach = amount / selectedContacts.length;
        selectedContacts.forEach((element) => {
            sendTransation(element, amountToEach)
        })
        //sendTransation(selectedContacts[0] , amountToEach)

    }

    const sendTransation = async (contact, amount) => {
        let tranAmount = amount;
        const toContact = contact;
        console.log(amount, contact);
        console.log(`payWithMetamask(receiver=${contact}, sender=${userInfo.account}, strEther=${amount})`)
        //payMeta(userInfo.account,contact.address,amount)
        console.log(web3);
        console.log(web3.utils.isAddress(contact));
        try {

            const transactionData = await web3.eth.sendTransaction({ to: contact, from: userInfo.account, value: web3.utils.toWei(String(amount), "ether") })
            console.log('txnHash is ', transactionData);
            addTransaction(transactionData.to, transactionData, tranAmount)
            console.log(toContact);
            upDateBalance()
            //var receipt = await web3.eth.getTransactionReceipt(transactionData.transactionHash)
            //console.log('txndata ' , web3.utils.fromWei(transactionData.effectiveGasPrice, 'ether'));
        } catch (e) {
            console.log("payment fail!");
            console.log(e);
        }



    }


    const handleClose = () => {

        closeSplitPayment()
        setIsSelected(false)
    };


    const amountChange = (event) => {
        setAmount(event.target.value);
    }


    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}

            >{!isSelected ? (<React.Fragment> <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Select Contacts
 </BootstrapDialogTitle>
                <DialogContent dividers className='w-80'>
                    <SwitchesGroup contacts={contacts} switchData={switchData} handleChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleSubmit}>
                        Save
   </Button>
                </DialogActions></React.Fragment>) : (<React.Fragment> <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Total amount to be send
 </BootstrapDialogTitle>
                    <DialogContent dividers sx={{ width: '400px' }}>

                        <div>*approx {amount / selectedContacts.length} each</div>
                        <OutlinedInput

                            value={amount}
                            fullWidth
                            type='number'
                            sx={{ width: '300px' }}
                            onChange={amountChange}
                            error={amount > userInfo.balance}
                            //startAdornment= {<InputAdornment position="start"> {amount/selectedContacts.length}</InputAdornment>}
                            endAdornment={<InputAdornment position="end">{userInfo.connectionid === 3 ? (<SvgIcon component={Ether} viewBox="0 0 600 476.6" />) : (<SvgIcon component={Matic} viewBox="0 0 1100 1000  " />)} </InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"

                        />


                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleTransfer}>
                            Transfer
   </Button>
                    </DialogActions></React.Fragment>)}

            </BootstrapDialog>
        </div>
    );
}
