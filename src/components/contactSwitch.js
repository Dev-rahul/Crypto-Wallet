import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';

export default function SwitchesGroup(props) {
    const { switchData, contacts, handleChange } = props

    return (
        <FormControl component="fieldset" variant="standard" >
            <FormLabel component="legend"></FormLabel>
            <FormGroup>
                {contacts.map((element) => {
                    return (
                        <FormControlLabel
                            key={element.address}
                            control={
                                <Switch checked={switchData[element.address]} onChange={handleChange} name={element.address} />
                            }
                            label={element.contactName}
                        />)
                })}

            </FormGroup>
            <FormHelperText>*Select atleast 1 contact</FormHelperText>
        </FormControl>
    );
}
