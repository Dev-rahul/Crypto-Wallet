import  React, {useRef, useState} from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import SvgIcon from '@mui/material/SvgIcon';
import Ether from '../assets/icons/ethereum.svg'
import Matic from '../assets/icons/matic.svg'

export default function AmountField(props) {
    const [amount, setAmount] = useState(0)

    const { userInfo, balance , onSend , contact} = props

    
    const amountChange = (event) => {
        setAmount(event.target.value);
    }
    return (<>
        <OutlinedInput
        value={amount}
        fullWidth
        type='number'
        sx={{ width: '500px' }}
        onChange={amountChange}
        error={amount > balance}
        endAdornment={<InputAdornment position="end">{userInfo.connectionid === 3 ? (<SvgIcon component={Ether} viewBox="0 0 600 476.6" />) : (<SvgIcon component={Matic} viewBox="0 0 1100 1000  " />)}</InputAdornment>}
        aria-describedby="outlined-weight-helper-text"

    />
    <IconButton aria-label="add" size="large" onClick={() => { onSend(contact , amount) }} >
        <SendIcon fontSize="small" />
    </IconButton>
    </>
    );
}
