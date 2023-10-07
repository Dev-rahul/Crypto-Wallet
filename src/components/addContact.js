import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';


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

export default function AddContactDialog(props) {
    const { open, web3, closeAddContact, submitContactForm } = props
    const formikRef = useRef();



    const handleClose = () => {

        closeAddContact()
    };
    const handleSubmit = () => {

        let values = formikRef.current.values
        values.address = values.address.toLowerCase();
        console.log(values.address, 'address');
        submitContactForm(values)
        closeAddContact()

    }

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}

            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Contact
        </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Formik
                        initialValues={{
                            contactName: '',
                            address: ''

                        }}
                        innerRef={formikRef}
                        onSubmit={async (values) => {
                            await new Promise((r) => setTimeout(r, 500));
                            console.log(JSON.stringify(values, null, 2));
                        }}
                    >{formik => (
                        <div>
                            <TextField
                                id="contact-name"
                                name="contactName"
                                label="Contact Name"
                                value={formik.values.contactName}
                                onChange={formik.handleChange}
                                error={formik.touched.contactName}
                                helperText={formik.touched.contactName ? 'Enter Contact Name' : ""}
                            />
                            <TextField
                                id="address"
                                name="address"
                                label="Address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                error={!web3.utils.isAddress(formik.values.address)}
                                helperText={formik.touched.address ? "Enter Contact Address" : ''}
                            />
                        </div>
                    )}

                    </Formik>

                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleSubmit}>
                        Save
          </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
