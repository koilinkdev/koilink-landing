import React from "react";
import {
    Dialog,
    DialogTitle,
    IconButton,
    Box,
    styled,
    DialogProps,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { common, primary } from "@/theme/palette";
import { primaryFont } from "@/theme/typography";

interface DashboardModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
    children: React.ReactNode;
    maxWidth?: DialogProps["maxWidth"];
    slotProps?: DialogProps["slotProps"];

}

const StyledDashboardModal = styled(Dialog)`
      
      
      .MuiDialog-paper{
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0px -2px 5px rgba(109, 157, 197, 0.25);
        display: flex;
        flex-direction: column;
        max-height: 90vh;

        .modalCloseBtn{
            position: absolute;
            top: 18px;
            right: 18px;
            width: 24px;
            height: 24px;
            background-color: ${primary.light};
            padding: 0;
            .MuiSvgIcon-root{
                color: ${common.color31445A}
            }

            &:hover{
                background-color: ${primary.main};
                .MuiSvgIcon-root{
                    color: ${common.white}
                }
            }
        }
        .MuiDialogTitle-root{
            padding: 20px 30px;
            h2{
                font-size: 16px;
                font-weight: 600;
                color: ${primary.main};
                font-family: ${primaryFont.style.fontFamily};
            }   
        }
        .MuiDialogActions-root{
            padding: 20px 30px;
        }

        .MuiDialogContent-root{
            padding: 30px;
            overflow-y: auto;
            flex: 1;
            min-height: 0;
        }
      }

      /* filter modal style */
    .filter_modal_form{
    .modal_form_header{
        .form_header_text{
         
               font-size: 14px;
            font-weight: 500;
            color: ${primary.main};
            text-align: center;
         
        }
        .form_header_btn{
            font-size: 14px;
            font-weight: 500;
            color: ${primary.light};
           
        }     

    }
     .linking_cont{
            font-size: 14px;
            font-weight: 500;
            color: ${common.color6D9DC5};
            text-align: center;
            a{
                text-decoration:none;
                color:${primary.main};
                &:hover{
                 text-decoration: underline;
                 
                }
            }                
        }
}

/* logout modal style */
.logout_modal_inner_wrap {
  .logout_text {
    font-size: 18px;
    font-weight: 600;
    color: ${primary.main};
  }

  .checkbox_inp_cont {
    width: 100%;
    display: flex;
    align-items: center;
    .MuiFormControlLabel-label {
      font-size: 14px;
      font-weight: 500;
      margin: 0;
      color: ${common.color6D9DC5};
    }
    .MuiCheckbox-root {
      /* margin:0px 8px 0px 10px; */
      /* padding: 0; */

      .MuiSvgIcon-root {
        font-size: 20px;
        color: ${common.colorD5D7DA};
        border-radius: 4px;
        
      }
      &.Mui-checked {
        .MuiSvgIcon-root{
            color: ${primary.main};
        }
      }
    }
  }
}
`
const DashboardModal: React.FC<DashboardModalProps> = ({
    open,
    onClose,
    title,
    closeOnEscape = true,
    closeOnOverlayClick = true,
    children,
    maxWidth,
    slotProps,

}) => {
    const handleClose = (
        _: unknown,
        reason: "backdropClick" | "escapeKeyDown"
    ) => {
        if (
            (reason === "backdropClick" && !closeOnOverlayClick) ||
            (reason === "escapeKeyDown" && !closeOnEscape)
        ) {
            return;
        }
        onClose();
    };

    return (
        <StyledDashboardModal
            open={open}
            onClose={handleClose}
            maxWidth={maxWidth}
            slotProps={slotProps}
        >
            <IconButton
                onClick={onClose}
                className="modalCloseBtn"
            >
                <CloseIcon
                    sx={{
                        fontSize: "16px"
                    }}

                />
            </IconButton>
            {title &&

                <DialogTitle
                    component={Box}
                    className="modal_title"
                >
                    <Typography variant="h2">{title}</Typography>
                </DialogTitle>
            }


            {children}

            {/* <DialogContent>{children}</DialogContent> */}
        </StyledDashboardModal>
    );
};

export default DashboardModal;

