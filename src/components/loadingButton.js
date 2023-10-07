import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';



export default function LoadingButtonComponent(props) {

const {text , isLoading, action, endIcon} = props


  return (
    <LoadingButton
    size="small"
    onClick={action}
    endIcon={endIcon ?? null}
    loading={isLoading}
    loadingIndicator="Loading..."
    variant="outlined"
  >
   {text}
  </LoadingButton>
  );
}
