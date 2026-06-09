import { background, common, primary, secondary } from '@/theme/palette'
import { Box,styled } from '@mui/material'

export const NotificationCardStyled = styled(Box)`
    background-color: ${background.paper};
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    padding: 15px 16px;
    display: flex;
    align-items: flex-start;
    cursor: pointer; 
    transition: all 0.2s ease; 
    
    &:hover {
        box-shadow: 0px 6px 35px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
    }
    
    .NotificationCard_RightSec {
        padding-left: 8px;
        flex-basis: calc(100% - 48px); 
        
        .notificationCard_title_time_cont {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            
            .notificationCard_time {
                flex-shrink: 0;
                margin-left: 8px;
                text-align: right;
                color:${common.color515978};
                font-size: 12px;
                font-weight:600;
                line-height:2;
            }
            
            .notificationCard_title {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                min-width: 0;
                color:${secondary.main};
                font-size: 14px;
                font-weight:400;
                line-height: 1.8;
            }
        }
        
        .description_badge_cont {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            
            .notificationCard_description {
                flex: 1;
                /* min-width: 0;  */
                height: 40px;
                color:${common.color515978};
                font-size: 12px;
                font-weight:400;
                line-height: 1.6;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                padding-right:16px;
            }
            .notificationCard_badge_cont{
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color:${primary.main};
                display: flex;
                justify-content: center;
                align-items: center;
                
                 span{
                    font-size:10px;
                    font-weight: 600;
                    color: ${common.white};
                    line-height: 1;
                    display: flex;  
                    align-items: center;
                    justify-content: center;
                 }
            }
        }
    }
`