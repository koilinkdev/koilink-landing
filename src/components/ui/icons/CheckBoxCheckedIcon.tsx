import { CustomIconProps } from '@/interface'
import React from 'react'

const CheckBoxCheckedIcon = ({ width, height }: CustomIconProps) => {
    return (
        <svg width={width ? width : "23"} height={height ? height : "23"} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.39062" y="0.777344" width="21" height="21" rx="4.5" stroke="#109DA4" />
            <g clipPath="url(#clip0_2172_14187)">
                <path d="M9.32493 17.0086L4.12493 11.8086C3.81252 11.4962 3.81252 10.9896 4.12493 10.6772L5.25627 9.54583C5.56868 9.23339 6.07524 9.23339 6.38765 9.54583L9.89062 13.0488L17.3936 5.54583C17.706 5.23342 18.2126 5.23342 18.525 5.54583L19.6563 6.6772C19.9687 6.98961 19.9687 7.49614 19.6563 7.80858L10.4563 17.0086C10.1439 17.321 9.63734 17.321 9.32493 17.0086Z" fill="#109DA4" />
            </g>
            <defs>
                <clipPath id="clip0_2172_14187">
                    <rect width="16" height="16" fill="white" transform="translate(3.89062 3.27734)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default CheckBoxCheckedIcon
