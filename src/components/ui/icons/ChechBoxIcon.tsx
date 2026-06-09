import { CustomIconProps } from '@/interface'
import React from 'react'

const ChechBoxIcon = ({height, width} : CustomIconProps) => {
    return (
        <svg width={width ? width : "23"} height={height ? height : "23"} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.39062" y="0.777344" width="21" height="21" rx="4.5" stroke="#E8EBEC" />
        </svg>

    )
}

export default ChechBoxIcon
