import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from '@mui/material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import Ether from '../assets/icons/ethereum.svg'
import Matic from '../assets/icons/matic.svg'
import _ from 'lodash'



const currencyIconArray = [<SvgIcon component={Ether} viewBox="0 0 600 476.6" />, <SvgIcon component={Matic} viewBox="0 0 1100 1000  " />,'BTC']


export default function TransactionsList(props) {
 const {transactions , currency} = props
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div className="w-80 m-2">
        {typeof transactions !== 'undefined' && transactions.length > 0 && transactions.map((item, index)=>{
            return(<Accordion className='w-full'key={index}  expanded={expanded === item.hash} onChange={handleChange(item.hash)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
              {item.id === 3 ?<SvgIcon component={Ether} viewBox="0 0 600 476.6" /> :<SvgIcon component={Matic} viewBox="0 0 1100 1000  " />}{_.floor(item.value, 5)}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{item.date.toLocaleString()}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography  className='truncate'>
              <Link target="_blank"  href={item.blockExpUrl}>{item.hash}</Link>
    
              </Typography>
            </AccordionDetails>
          </Accordion>)
        })}
      
     
    </div>
  );
}
