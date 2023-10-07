import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export default function Dashboard(props) {

    const { userInfo } = props
    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: 'full',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    bgcolor: '#1F1E25',
                    color: 'text-white',
                    '& svg': {
                        m: 1.5,
                    },
                    '& hr': {
                        mx: 0.5,
                    },
                }}
            >
                <div className=' w-full p-1'> Network : {userInfo.connectionid === 3 ? 'Ethereum' : 'Polygon'}</div>

                <Divider orientation="vertical" className='bg-white' variant="middle" flexItem />
                <div className=' w-full text-right p-1 truncate'> Balance :  {userInfo.balance}</div>

            </Box>
        </div>
    );
}
