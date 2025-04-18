import React from 'react'

export default function SmallNewsCover({title}) {
    return (
        <div >
            <div className='my-3 flex justify-center'>

                <h2 className='text-[15px] font-times w-5/6'>{title}</h2>
            </div>
                <h2 className='bg-gray-400 h-[1px] rounded-lg w-full'></h2>
        </div>
    )
}
