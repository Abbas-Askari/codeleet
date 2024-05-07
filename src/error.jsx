import React from 'react'

function Error() {
    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div className="text-center">
                <div className="font-bold text-error text-4xl">Opps!</div>
                <div className='text-lg mt-2'>Something went wrong</div>
            </div>
        </div>
    )
}

export default Error