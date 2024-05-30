import React, { ReactNode } from 'react'

interface Props {children:ReactNode}

export function ContentPage(props: Props) {
    const {children} = props

    return (
        <div className="border-[#DFE3E8] p-[24px]">
        {children}
        </div>
    )
}

