
export const initialRoundedButton = {
    pl: 2, // Horizontal padding
    borderRadius: '50px', // Rounded corners
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
    minWidth: '90px',
}

export const tableAddButton = {
    bgcolor: '#4580ff', // Background color
    color: 'white', // Text color
    '&:hover': {
        bgcolor: '#4580ff', // Background color on hover
        opacity: 0.9, // Adjust opacity on hover
        boxShadow: 'none',
    },
    pl: 2, // Horizontal padding
    pr: 3, // Horizontal padding
    borderRadius: '50px', // Rounded corners
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
}

export const tableSaveButton = {
    bgcolor: '#4580ff', // Background color
    color: 'white', // Text color
    '&:hover': {
        bgcolor: '#4580ff', // Background color on hover
        opacity: 0.9, // Adjust opacity on hover
        boxShadow: 'none',
    },
    ...initialRoundedButton
}

export const tableCancelButton = {
    bgcolor: '#f2f6fa', // Background color
    color: '#1f325c', // Text color
    '&:hover': {
        bgcolor: '#f2f6fa', // Background color on hover
        opacity: 0.9, // Adjust opacity on hover
        boxShadow: 'none',
    },
    ...initialRoundedButton
}

const modalBtnStyle = {
    px: 4, // Horizontal padding
    py: 0.5,  // Vertical padding
    borderRadius: '4px', // Rounded corners
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
};

export const modalCancelBtnStyle = {
    bgcolor: 'white', // Background color
    color: 'black', // Text color
    '&:hover': {
        bgcolor: '#edf0f2', // Background color on hover
        opacity: 0.9, // Adjust opacity on hover
        boxShadow: 'none',
    },
    ...modalBtnStyle
}

export const outlineBtnStyle = {
    bgcolor: 'white', // Background color
    color: '#003133',
    borderColor: '#003133',
    border: '2px solid', // Set the border style
    py: 0.5,  // Vertical padding
    px: 3,
    borderRadius: '6px', // Rounded corners
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: '500',
    minWidth: '90px',
    fontSize: '0.875rem',
    '&:hover': {
        opacity: 0.6, // Adjust opacity on hover
        boxShadow: 'none',
    },
}

export const modalOkBtnStyle = {
    bgcolor: '#003133', // Background color
    color: 'white', // Text color
    '&:hover': {
        bgcolor: '#003133', // Background color on hover
        opacity: 0.9, // Adjust opacity on hover
        boxShadow: 'none',
    },
    ...modalBtnStyle
}

export const sendEmailBtnStyle = {
    px: 4, // Horizontal padding
    py: 1,  // Vertical padding
    borderRadius: '4px', // Rounded corners
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
    bgcolor: '#003133', // Background color
    color: 'white', // Text color
    '&:hover': {
        bgcolor: '#003133', // Background color on hover
        opacity: 0.9, // Adjust opacity on hover
        boxShadow: 'none',
    },
}

export const tagStyle = {
    borderRadius: '1.25rem',
    color: 'white',
    fontSize: '0.75rem',
    py: '0.375rem',
    px: '0.75rem',
}


export const refineBtnStyle = {
    bgcolor: 'white', // Background color
    // border: '2px solid', // Set the border style
    py: 0.5,  // Vertical padding
    borderRadius: '20px', // Rounded corners
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: '500',
    minWidth: '90px',
    fontSize: '0.875rem',
    '&:hover': {
        bgcolor: 'white', // Background color on hover
        opacity: 0.9, // Adjust opacity on hover
        boxShadow: 'none',
    },
}

export const editRefineBtnStyle = {
    // color: '#11ba82',
    // borderColor: '#11ba82',
    color: '#003133',
    borderColor: '#003133',
    ...refineBtnStyle
}

export const deleteRefineBtnStyle = {
    // color: '#fa5252',
    // borderColor: '#fa5252',
    color: '#003133',
    // borderColor: '#003133',
    ...refineBtnStyle
}

export const refreshRefineBtnStyle = {
    // color: '#4580ff',
    // borderColor: '#4580ff',
    color: '#003133',
    borderColor: '#003133',
    ...refineBtnStyle
}


export const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '4px',
    px: 2,
    py: 2,
    '&:focus': {
        outline: 'none', // Ensure focus outline is removed
    },
};


export const deleteModalButtonStyle = {
    px: 2.5, // Horizontal padding
    py: 0.5,  // Vertical padding
    borderRadius: '4px', // Rounded corners
    boxShadow: 'none',
    textTransform: 'none',
    fontWeight: '500',
    fontSize: '0.75rem',
};